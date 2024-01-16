let eventBus = new Vue()


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
                eventBus.$emit('review-submitted', productReview)
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

  Vue.component('product-tabs', {
    template: `
    <div>   
      <ul>
        <span class="tab"
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Reviews'">
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
      <div v-show="selectedTab === 'Make a Review'">
      <product-review></product-review>
      </div>
      <div v-show="selectedTab === 'Shipping'">
      <p>Shipping: {{ shipping }}</p>
      </div>
      <div v-show="selectedTab === 'Details'">
      <product-details :details='details'></product-details>
      </div>
    </div>
`,

  
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
        }
    },
    props: {
      reviews: {
          type: Array,
          required: false
      },
      shipping:{
        type: String,
        required: true
      }
   },

   
  })
  

  
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
        <div class="size">
        <li  v-on:click="updatesize(size)">{{size}}</li>
        </div>
     </ul>
     <p>Выбран размер: {{selected_size}}</p>

     
    </div>

    <a :href="link">More products like this</a>
 


    <product-tabs :shipping="shipping" :reviews="reviews"></product-tabs>
    <button v-on:click="removeReviews">Remove reviews</button>
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
      selected_size: "S",
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    };
  },
  methods: {
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId,this.selected_size
      );
    },
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId,this.variants[this.selectedVariant].variantColor,this.selected_size);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    removeReviews(){
      console.log(this.reviews)
      this.reviews = [];
      localStorage.removeItem('reviews')
    },
    updatesize(size){
      this.selected_size = size
      console.log(this.selected_size)
    }
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
  mounted() {
    if (localStorage.getItem('reviews')) {
      try {
        this.reviews = JSON.parse(localStorage.getItem('reviews'));
      } catch(e) {
        localStorage.removeItem('reviews');
      }
    }
    eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)

        const parsed = JSON.stringify(this.reviews);
        localStorage.setItem('reviews', parsed);

    })
    
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
    updateplusCart(id,color,size) {
      this.cart.push([id,color,size]);
    },
    updateminusCart(id,size) {
      console.log("Удалён объект ", id, size);
      let index = this.cart.indexOf(id);
      for(i in this.cart){
        if(this.cart[i][0]==id && this.cart[i][2]==size){
          this.cart.splice(i, 1);
          break;
        }
      }

    },
  },
});


