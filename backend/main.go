package main

import (
	"encoding/json"
	"fmt"
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
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

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

		fmt.Println("Hello?")

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

		initials := fourier.GetInitialConds(points, req.N)

		initials_str, err := json.Marshal(initials)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "dunno"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"initials": string(initials_str)})

	}
}

func TransformRoute(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("transform", controller())
}

func main() {
	port := "8080"

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(CORSMiddleware())

	TransformRoute(router)

	router.Run(":" + port)
}
