package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

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

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	db, err := connectDB()

	if err != nil {
		log.Println(err)
	}

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	router.GET("/users", func(c *gin.Context) {
		var users []User

		res := db.Find(&users)

		if res.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": res.Error.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, users)
	})

	router.POST("/login", login(db))

	port := os.Getenv("PORT")
	addr := ":" + port
	rerr := router.Run(addr)
	if rerr != nil {
		log.Println(err)
	}
}
