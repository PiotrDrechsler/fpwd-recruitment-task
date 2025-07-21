// Alpine.js Product Page Component
function productPage() {
    return {
        // Data properties
        product: {},
        recommendedProducts: [],

        // Selection states
        selectedColor: null,
        selectedSize: null,
        selectedWidth: 'B',
        selectedImage: null,

        // UI states
        showSizeModal: false,
        showSizeGuide: false,
        loading: true,
        error: null,
        addToCartText: 'Add to Cart',

        // Initialize component
        async init() {
            console.log('Initializing product page...');
            try {
                await this.loadProductData();
                await this.loadRecommendedProducts();
                this.setDefaults();
                this.loading = false;
                console.log('Product page initialized successfully');
            } catch (error) {
                this.error = 'Failed to load product data';
                this.loading = false;
                console.error('Error initializing product page:', error);
            }
        },

        // Load main product data
        async loadProductData() {
            try {
                console.log('Loading product data...');
                const response = await fetch('./data/product.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.product = await response.json();
                console.log('Product data loaded:', this.product);
            } catch (error) {
                console.error('Failed to load product.json:', error);
                this.error =
                    'Failed to load product data. Please check if data/product.json exists.';
                throw error;
            }
        },

        // Load recommended products
        async loadRecommendedProducts() {
            try {
                console.log('Loading recommendations...');
                const response = await fetch('./data/recommendations.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.recommendedProducts = await response.json();
                console.log('Recommendations loaded:', this.recommendedProducts);
            } catch (error) {
                console.error('Failed to load recommendations.json:', error);
                this.error =
                    'Failed to load recommendations. Please check if data/recommendations.json exists.';
                throw error;
            }
        },

        // Set default selections
        setDefaults() {
            if (this.product.colors && this.product.colors.length > 0) {
                this.selectedColor = this.product.colors[0];
            }
            if (this.product.images && this.product.images.length > 0) {
                this.selectedImage = this.product.images[0];
            }
            if (this.product.widths && this.product.widths.length > 0) {
                this.selectedWidth = this.product.widths[0];
            }
            console.log('Defaults set:', {
                color: this.selectedColor?.name,
                width: this.selectedWidth,
                image: this.selectedImage?.alt,
            });
        },

        // Select size and close modal
        selectSize(size) {
            this.selectedSize = size;
            this.showSizeModal = false;
            console.log('Size selected:', size);
        },

        // Format price for display
        formatPrice(price) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(price);
        },

        // Add to cart functionality
        addToCart() {
            if (!this.selectedSize) {
                alert('Please select a size');
                return;
            }

            const cartItem = {
                productId: this.product.id,
                name: this.product.name,
                price: this.product.price,
                color: this.selectedColor.name,
                size: this.selectedSize,
                width: this.selectedWidth,
                image: this.selectedImage.src,
            };

            // In a real app, this would send to an API
            console.log('Adding to cart:', cartItem);

            // Show success feedback
            this.showAddToCartSuccess();
        },

        // Show add to cart success message
        showAddToCartSuccess() {
            const originalText = this.addToCartText;
            this.addToCartText = 'Added to Cart!';

            setTimeout(() => {
                this.addToCartText = originalText;
            }, 2000);
        },
    };
}
