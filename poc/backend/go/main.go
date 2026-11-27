package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "poc/docs"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//	@title			AREA Backend API
//	@version		1.0
//	@description	Simple backend API for AREA POC.
//	@host			localhost:8080
//	@BasePath		/

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type JWTClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey;column:id"`
	Username  string    `json:"username" gorm:"column:username"`
	Email     string    `json:"email" gorm:"column:email"`
	Password  string    `json:"-" gorm:"column:password_hash"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
}

func (User) TableName() string {
	return "users"
}

func connectDB() (*gorm.DB, error) {
	dbUrl := os.Getenv("DATABASE_URL")

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	return db, err
}

// login godoc
//
//	@Summary		Login
//	@Description	Authenticate a user and return a JWT.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			credentials	body		main.LoginRequest	true	"Login credentials"
//	@Success		200			{object}	map[string]interface{}
//	@Failure		400			{object}	map[string]string
//	@Failure		401			{object}	map[string]string
//	@Failure		500			{object}	map[string]string
//	@Router			/login [post]
func login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input LoginRequest

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}

		var user User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}

		if user.Password != input.Password {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}

		claims := JWTClaims{
			Username: user.Username,
			RegisteredClaims: jwt.RegisteredClaims{
				Subject:   strconv.FormatUint(uint64(user.ID), 10),
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
				IssuedAt:  jwt.NewNumericDate(time.Now()),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Could not generate token",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
			"user": gin.H{
				"id":       user.ID,
				"username": user.Username,
				"email":    user.Email,
			},
		})
	}
}

// health godoc
//
//	@Summary		Health check
//	@Description	Returns service health status.
//	@Tags			health
//	@Produce		json
//	@Success		200	{object}	map[string]string
//	@Router			/health [get]
func health() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	}
}

// GetUsers godoc
//
//	@Summary		List users
//	@Description	Returns all users.
//	@Tags			users
//	@Produce		json
//	@Success		200	{array}		main.User
//	@Failure		500	{object}	map[string]string
//	@Router			/users [get]
func GetUsers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var users []User

		res := db.Find(&users)

		if res.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": res.Error.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, users)
	}
}

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	db, err := connectDB()

	if err != nil {
		log.Println(err)
	}

	router := gin.Default()

	router.GET("/health", health())
	router.GET("/users", GetUsers(db))
	router.POST("/login", login(db))
	router.GET("/swagger/*any", func(c *gin.Context) {
		if c.Param("any") == "/" {
			c.Redirect(http.StatusFound, "/swagger/index.html")
			return
		}
		ginSwagger.WrapHandler(swaggerFiles.Handler)(c)
	})

	port := os.Getenv("PORT")
	addr := ":" + port
	rerr := router.Run(addr)
	if rerr != nil {
		log.Println(err)
	}
}
