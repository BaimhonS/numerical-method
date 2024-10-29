package services

import (
	"github.com/BaimhonS/numerical-method/models"
	"github.com/BaimhonS/numerical-method/utils"
	"github.com/BaimhonS/numerical-method/validations"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type RootServiceImpl struct {
	DB *gorm.DB
}

type RootService interface {
	GetGraphical(c *fiber.Ctx) error
	CreateGraphical(c *fiber.Ctx) error
	GetBisection(c *fiber.Ctx) error
	CreateBisection(c *fiber.Ctx) error
	GetFalsePosition(c *fiber.Ctx) error
	CreateFalsePosition(c *fiber.Ctx) error
	GetOnePoint(c *fiber.Ctx) error
	CreateOnePoint(c *fiber.Ctx) error
	GetNewtonRaphson(c *fiber.Ctx) error
	CreateNewtonRaphson(c *fiber.Ctx) error
	GetSecant(c *fiber.Ctx) error
	CreateSecant(c *fiber.Ctx) error
}

func NewRootService(db *gorm.DB) RootService {
	return &RootServiceImpl{
		DB: db,
	}
}

// @Tags Graphical
// @Summary Get Graphical Method Result
// @Description Get the graphical method result by ID
// @Accept json
// @Produce json
// @Param id path string true "Graphical ID"
// @Success 200 {object} models.Graphical
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/graphical/{id} [get]
func (s *RootServiceImpl) GetGraphical(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var graphical models.Graphical

	if err := s.DB.First(&graphical, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Graphical data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching graphical data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(graphical)
}

// @Tags Graphical
// @Summary Create Graphical Method Result
// @Description Create the graphical method
// @Accept json
// @Produce json
// @Param req body validations.ReqGraphical true "Request Body"
// @Success 200 {object} models.Graphical
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/graphical [post]
func (s *RootServiceImpl) CreateGraphical(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqGraphical)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	graphical := models.Graphical{
		Equation: req.Equation,
		Scan:     req.Scan,
	}

	if err := s.DB.Create(&graphical).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(graphical)
}

// @Tags Bisection
// @Summary Get Bisection Method Result
// @Description Get the Bisection method result by ID
// @Accept json
// @Produce json
// @Param id path string true "Bisection ID"
// @Success 200 {object} models.Bisection
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/bisection/{id} [get]
func (s *RootServiceImpl) GetBisection(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var bisection models.Bisection

	if err := s.DB.First(&bisection, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Bisection data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching bisection data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(bisection)
}

// @Tags Bisection
// @Summary Create Bisection Method Result
// @Description Create the Bisection method
// @Accept json
// @Produce json
// @Param req body validations.ReqBisection true "Request Body"
// @Success 200 {object} models.Bisection
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/bisection [post]
func (s *RootServiceImpl) CreateBisection(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqBisection)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	bisection := models.Bisection{
		Equation: req.Equation,
		Xl:       req.Xl,
		Xr:       req.Xr,
		E:        req.E,
	}

	if err := s.DB.Create(&bisection).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(bisection)
}

// @Tags FalsePosition
// @Summary Get FalsePosition Method Result
// @Description Get the FalsePosition method result by ID
// @Accept json
// @Produce json
// @Param id path string true "FalsePosition ID"
// @Success 200 {object} models.FalsePosition
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/false-position/{id} [get]
func (s *RootServiceImpl) GetFalsePosition(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var falsePosition models.FalsePosition

	if err := s.DB.First(&falsePosition, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "FalsePosition data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching false position data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(falsePosition)
}

// @Tags FalsePosition
// @Summary Create FalsePosition Method Result
// @Description Create the FalsePosition method
// @Accept json
// @Produce json
// @Param req body validations.ReqFalsePosition true "Request Body"
// @Success 200 {object} models.FalsePosition
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/false-position [post]
func (s *RootServiceImpl) CreateFalsePosition(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqFalsePosition)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	falsePosition := models.FalsePosition{
		Equation: req.Equation,
		Xl:       req.Xl,
		Xr:       req.Xr,
		E:        req.E,
	}

	if err := s.DB.Create(&falsePosition).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(falsePosition)
}

// @Tags OnePoint
// @Summary Get OnePoint Method Result
// @Description Get the OnePoint method result by ID
// @Accept json
// @Produce json
// @Param id path string true "OnePoint ID"
// @Success 200 {object} models.OnePoint
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/one-point/{id} [get]
func (s *RootServiceImpl) GetOnePoint(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var onePoint models.OnePoint

	if err := s.DB.First(&onePoint, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "One point data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching one point data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(onePoint)
}

// @Tags OnePoint
// @Summary Create OnePoint Method Result
// @Description Create the OnePoint method
// @Accept json
// @Produce json
// @Param req body validations.ReqOnePoint true "Request Body"
// @Success 200 {object} models.FalsePosition
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/one-point [post]
func (s *RootServiceImpl) CreateOnePoint(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqOnePoint)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	onePoint := models.OnePoint{
		Equation: req.Equation,
		E:        req.E,
	}

	if err := s.DB.Create(&onePoint).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(onePoint)
}

// @Tags NewtonRaphson
// @Summary Get NewtonRaphson Method Result
// @Description Get the NewtonRaphson method result by ID
// @Accept json
// @Produce json
// @Param id path string true "NewtonRaphson ID"
// @Success 200 {object} models.NewtonRaphson
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/newton-raphson/{id} [get]
func (s *RootServiceImpl) GetNewtonRaphson(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var newtonRaphson models.NewtonRaphson

	if err := s.DB.First(&newtonRaphson, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Newton Raphson data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching newtonRapson data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(newtonRaphson)
}

// @Tags NewtonRaphson
// @Summary Create NewtonRaphson Method Result
// @Description Create the NewtonRaphson method
// @Accept json
// @Produce json
// @Param req body validations.ReqNewtonRaphson true "Request Body"
// @Success 200 {object} models.FalsePosition
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/newton-raphson [post]
func (s *RootServiceImpl) CreateNewtonRaphson(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqNewtonRaphson)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	newtonRaphson := models.NewtonRaphson{
		Equation: req.Equation,
		X0:       req.X0,
		E:        req.E,
	}

	if err := s.DB.Create(&newtonRaphson).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(newtonRaphson)
}

// @Tags Secant
// @Summary Get Secant Method Result
// @Description Get the Secant method result by ID
// @Accept json
// @Produce json
// @Param id path string true "Secant ID"
// @Success 200 {object} models.Secant
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/secant/{id} [get]
func (s *RootServiceImpl) GetSecant(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "ID parameter is required",
		})
	}

	var secant models.Secant

	if err := s.DB.First(&secant, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(utils.ErrorResponse{
				Message: "Secant data not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Error fetching secant data",
		})
	}
	return c.Status(fiber.StatusOK).JSON(secant)
}

// @Tags Secant
// @Summary Create Secantn Method Result
// @Description Create the Secant method
// @Accept json
// @Produce json
// @Param req body validations.ReqSecant true "Request Body"
// @Success 200 {object} models.Secant
// @Failure 400 {object} utils.ErrorResponse "Bad Request"
// @Failure 404 {object} utils.ErrorResponse "Not Found"
// @Router /numerical-method/root-of-equations/secant [post]
func (s *RootServiceImpl) CreateSecant(c *fiber.Ctx) error {
	req, ok := c.Locals("req").(validations.ReqSecant)

	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(utils.ErrorResponse{
			Message: "local req not found",
		})
	}

	secant := models.Secant{
		Equation: req.Equation,
		X0:       req.X0,
		X1:       req.X1,
		E:        req.E,
	}

	if err := s.DB.Create(&secant).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(utils.ErrorResponse{
			Message: "Failed to save data to the database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(secant)
}
