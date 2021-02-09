function ViewModel() {
    var self = this;
    
    // Dark Mode configurations
    self.txtDarkLight = ko.observable("Dark Mode");
    self.cssDarkLight = ko.observable("light-mode");

    self.clickDarkLight = () => {
        if (self.cssDarkLight() == "dark-mode") {
            self.cssDarkLight("light-mode");
            self.txtDarkLight("Dark Mode");
        } else {
            self.cssDarkLight("dark-mode");
            self.txtDarkLight("Light Mode");
        }
    }

    // Product List in Cart configurations
    self.cartProductList = ko.observableArray([
        {id: 1, name: "Sunglasses Collection", category: "Glasses", price: 56, finalPrice: "$56.00", qty: ko.observable(1), image: "glasses.jpg"},
        {id: 2, name: "Luxury Watch Men", category: "Watches", price: 83, finalPrice: "$83.00", qty: ko.observable(1), image: "watch.jpg"},
        {id: 3, name: "Purse Card Wallet", category: "Wallets", price: 27, finalPrice: "$27.00", qty: ko.observable(1), image: "wallet.jpg"}
    ]);

    self.maskedPrice = ko.computed(() => {
        return self.cartProductList(
            self.cartProductList().map((product) => {
                product.finalPrice = toPriceMask(product.price);
                return product;
            })
        );
    });

    self.addToCart = (newProduct) => {
        let cartProduct = self.cartProductList().find(cartProduct => cartProduct.id == newProduct.id);
        
        if (cartProduct) {
            self.cartProductList(
                self.cartProductList().map((product) => {
                    if (product.id == newProduct.id) {
                        product.qty(product.qty() + 1);
                    }

                    return product;
                })
            );
        } else {
            newProduct.qty(1);
            self.cartProductList.push(newProduct);
        }
    }

    self.removeFromCart = (product) => {
        self.cartProductList.remove(product);
        if (self.cartProductList().length < 1) {
            self.optShippingMethod(0);
        }
    }

    self.cleanCart = () => {
        self.cartProductList.removeAll();
        self.optShippingMethod(0);
    }

    // Recommended product list configurations
    self.recommendedList = ko.observableArray([
        {id: 1, name: "Sunglasses Collection", category: "Glasses", price: 56, finalPrice: "$56.00", qty: ko.observable(1), image: "glasses.jpg"},
        {id: 2, name: "Luxury Watch Men", category: "Watches", price: 83, finalPrice: "$83.00", qty: ko.observable(1), image: "watch.jpg"},
        {id: 3, name: "Purse Card Wallet", category: "Wallets", price: 27, finalPrice: "$27.00", qty: ko.observable(1), image: "wallet.jpg"}
    ]);

    // Coupon configurations
    let coupons = [
        {name: "XMAS21", discount: 10},
        {name: "DISCOUNT20", discount: 20},
        {name: "BIGLIDIO", discount: 5}
    ];

    self.usedCoupon = ko.observable();
    self.inputCoupon = ko.observable();
    self.couponError = ko.observable("");

    this.tryCoupon = () => {
        let foundCoupon = coupons.find(coupon => coupon.name == self.inputCoupon().toUpperCase());

        if (foundCoupon) {
            self.usedCoupon(foundCoupon);
            self.inputCoupon("");
        } else {
            self.couponError("Coupon not found!");   
            setTimeout(() => self.couponError(""), 3000);
        }
    }

    this.maskedCouponDiscount = ko.computed(() => {
        return self.usedCoupon() ? '- ' + toPriceMask(self.usedCoupon().discount) : "$0.00";
    });

    // Summary configurations
    self.subtotal = ko.computed(() => {
        let subtotal = 0;

        self.cartProductList().forEach((product) => {
            subtotal += product.price * product.qty();
        });

        return subtotal;
    });

    self.maskedSubtotal = ko.computed(() => {
        return toPriceMask(self.subtotal());
    });

    self.optShippingMethod = ko.observable(0);

    self.maskedShippingPrice = ko.computed(() => {
        return toPriceMask(self.optShippingMethod());
    });

    self.total = ko.computed(() => {
        let total = self.subtotal() + parseInt(self.optShippingMethod());
        total -= self.usedCoupon() ? self.usedCoupon().discount: 0;
        total = (total > 0) ? total : 0;
        return toPriceMask(total);
    });

    // Tools
    function toPriceMask(value) {
        return "$" + parseInt(value).toFixed(2);
    }

}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);