package src

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
)

func SetRoute(app *fiber.App) {
	/*
		app.Get("/", func(c *fiber.Ctx) error {
			return RootHandler(c)
		})
	*/

	app.Post("/main", func(c *fiber.Ctx) error {
		return MainRouteHandler(c)
	})

	app.Post("/dogFoodList", func(c *fiber.Ctx) error {
		return DogFoodListRouteHandler(c)
	})

	app.Get("/applyFilterPage", func(c *fiber.Ctx) error {
		return ApplyFilterPageRouteHandler(c)
	})

	app.Get("/productDetail/:productId", func(c *fiber.Ctx) error {
		return ProductDetailRouteHandler(c)
	})

	app.Get("/productDetailPage/:productId", func(c *fiber.Ctx) error {
		return ProductDetailPageRouteHandler(c)
	})

	app.Post("/authFromEmail", func(c *fiber.Ctx) error {
		return AuthFromEmailRouteHandler(c)
	})

	app.Post("/tryLogin", func(c *fiber.Ctx) error {
		return TryLoginRouteHandler(c)
	})

	app.Post("/doLogout", func(c *fiber.Ctx) error {
		return DoLogoutRouteHandler(c)
	})

	app.Post("/changeHeart", func(c *fiber.Ctx) error {
		return ChangeHeartRouteHandler(c)
	})

	app.Post("/myInfo", func(c *fiber.Ctx) error {
		return MyInfoRouteHandler(c)
	})

	app.Post("/addShoppingBag", func(c *fiber.Ctx) error {
		return AddShoppingBagRouteHandler(c)
	})

	app.Post("/shoppingBagList", func(c *fiber.Ctx) error {
		return ShoppingBagListRouteHandler(c)
	})

	app.Post("/shoppingBagChangeCheck", func(c *fiber.Ctx) error {
		return ShoppingBagChangeCheckRouteHandler(c)
	})

	app.Post("/deleteShoppingBag", func(c *fiber.Ctx) error {
		return DeleteShoppingBagRouteHandler(c)
	})

	app.Post("/shoppingBagAllCheck", func(c *fiber.Ctx) error {
		return ShoppingBagAllCheckRouteHandler(c)
	})

	app.Get("/searchPage", func(c *fiber.Ctx) error {
		return SearchRouteHandler(c)
	})

	app.Post("/authVerifyEmail", func(c *fiber.Ctx) error {
		return AuthVerifyEmailRouteHandler(c)
	})

	app.Post("/signUp", func(c *fiber.Ctx) error {
		return SignUpRouteHandler(c)
	})

	app.Post("/authFindIdFromEmail", func(c *fiber.Ctx) error {
		return AuthFindIdFromEmailRouteHandler(c)
	})

	app.Post("/findId", func(c *fiber.Ctx) error {
		return FindIdRouteHandler(c)
	})

	app.Post("/authFindPasswordFromEmail", func(c *fiber.Ctx) error {
		return AuthFindPasswordFromEmailRouteHandler(c)
	})

	app.Post("/findPassword", func(c *fiber.Ctx) error {
		return FindPasswordRouteHandler(c)
	})

	app.Post("/changePassword", func(c *fiber.Ctx) error {
		return ChangePasswordRouteHandler(c)
	})

	app.Post("/reviewUpload", func(c *fiber.Ctx) error {
		return ReviewUploadRouteHandler(c)
	})

	app.Get("/adminOrderList", func(c *fiber.Ctx) error {
		return AdminOrderListRouteHandler(c)
	})

	app.Post("/changeState", func(c *fiber.Ctx) error {
		return ChangeStateRouteHandler(c)
	})
}
