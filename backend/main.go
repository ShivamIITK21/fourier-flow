package main

import (
	"encoding/json"
	"net/http"

	"github.com/ShivamIITK21/fourier-flow/fourier"
	"github.com/gin-gonic/gin"
)

type Request struct {
	Points string
	N      int
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func controller() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req Request

		err := c.BindJSON(&req)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error during Bind"})
			return
		}

		var points []fourier.Point

		err = json.Unmarshal([]byte(req.Points), &points)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error during Unmarshal"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"ok": "ok"})

	}
}

func TransformRoute(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("transform", controller())
}

func main() {
	port := "8080"

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(CORSMiddleware())

	TransformRoute(router)

	router.Run(":" + port)
}
