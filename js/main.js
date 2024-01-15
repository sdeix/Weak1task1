Vue.component("product-review", {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
     
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
     
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <div>
      <p>Would you recommend this product?</p>
      <input type="radio" v-model="recomend" name="rec" value="yes" id="yes"> <label for="yes">Yes</label>  </div>  
      <div>
      <input type="radio" v-model="recomend" name="rec" value="no" id="no"> <label for="no">No</label>
      </div>
      <p>
        <input type="submit" value="Submit"> 
      </p>
      
      <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
     </p>

   
     </form>
     
    `,
    data() {
      return {
        name: null,
        review: null,
        rating: null,
        recomend: null,
        errors: [],
      };
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recomend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recomend: this.recomend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recomend = null
            } else {
                this.errors = []
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recomend) this.errors.push("Reccomend required.")
            }
         }
         ,
    },
  });

Vue.component("product", {
  template: `
    <div class="product">
    <div class="product-image">
        <img :src="image" :alt="altText" />
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <p v-if="inventory > 10 && inStock != false">In stock</p>
      <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
      <p v-else :class="{ outofstock: !inStock}">Out of stock</p>


      <span>{{sale}}</span>

        <product-details :details='details'></product-details>


     <div  @mouseover="updateProduct(index)" class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }">

     </div>
     <button v-on:click="removeFromCart">Remove from cart</button>
     <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
     <ul v-for="size in sizes">
        <li>{{size}}</li>
     </ul>

     
    </div>
    <p>Shipping: {{ shipping }}</p>
    <a :href="link">More products like this</a>
    <div>

    <h2>Reviews</h2>
    <p v-if="!reviews.length">There are no reviews yet.</p>
    <ul>
    <li v-for="review in reviews">
    <p>{{ review.name }}</p>
    <p>Rating: {{ review.rating }}</p>
    <p>{{ review.review }}</p>
    <p>рекомендует ли человек продукт: {{ review.recomend }}</p>
    
    </li>
    </ul>
    </div>

    <product-review @review-submitted="addReview"></product-review>
  </div>
  `,
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      description: "A pair of warm, fuzzy socks",
      selectedVariant: 0,
      altText: "A pair of socks",
      link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
      inventory: 100,
      onSale: true,
      reviews: [],
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 1,
        },
      ],
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    };
  },
  methods: {
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addReview(productReview) {
        console.log(productReview)
      this.reviews.push(productReview);
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return "Проводится распродажа " + this.brand + this.product;
      }
      return "Распродажа не проводится";
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return 2.99;
      }
    },
  },
});

Vue.component("product-details", {
  template: `<ul  class="product-details">
  <li v-for='detail in details'>{{detail}}</li>

  </ul>`,
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
});

let app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateplusCart(id) {
      this.cart.push(id);
    },
    updateminusCart(id) {
      console.log("Удалён объект ", id);
      let index = this.cart.indexOf(id);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },
  },
});


