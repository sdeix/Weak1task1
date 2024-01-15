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

     <ul v-for="size in sizes">
        <li>{{size}}</li>
     </ul>

     <div class="cart">
        <p>Cart({{ cart }})</p>
        <button v-on:click="removeFromCart">Remove from cart</button>
        <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
     </div>
     
    </div>
    <p>Shipping: {{ shipping }}</p>
    <a :href="link">More products like this</a>
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
          variantQuantity: 0,
        },
      ],
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
      cart: 0,
    };
  },
  methods: {
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
    addToCart() {
      this.cart += 1;
    },
    updateProduct(index) {
      this.selectedVariant = index;
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
  },
});
