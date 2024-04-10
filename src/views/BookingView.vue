<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const booking = ref({
    email: '',
    noOfTicket: 1,
    gridRadios: 'Credit Card',
    term: '',
    superhero: '',
    terms: false
})

const submitBooking = async function () {

    var url = '/api/bookings';
    var method = 'POST';

if (route.name == 'update-booking') {
    url = url + '/' + booking.value._id;
    method = 'PUT';
}

// submit the booking to the backend
const response = await fetch(url, {
    method: method,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking.value)
});

    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);
    // alert the user
    alert(JSON.stringify(json));
}


// Use computed property to get the superheroes
const superheroes = computed(() => {
    if (booking.value.term == 'Avengers') {
        return ["Captain America", "Iron Man", "Thor", "Hulk", "Black Widow", "Hawkeye"];
    } else if (booking.value.term == "JLA") {
        return ["Superman", "Batman", "Wonder Woman", "Flash", "Green Lantern", "Aquaman"];
    } else {
        return [];
    }
});

import { useRoute,useRouter } from "vue-router";
const route = useRoute();
const router=useRouter();

// a function to get the booking from the backend
const getBooking = async function () {
    // get the booking from the backend
    const response = await fetch('/api/bookings/' + route.params.id);
    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);

    if (response.ok) {
    // set the booking
    booking.value = json;
} else {
    alert(json.message);
}
}


const deleteBooking = async function () {
    // post the booking to the backend
    const response = await fetch('/api/bookings/' + booking.value._id, {
        method: 'DELETE'
    });
    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);
    // alert the user
    alert(JSON.stringify(json));
    // redirect to the home page
    router.push('/');
}

onMounted(async () => {
    // if there is an id in the route
    if (route.params.id) {
        await getBooking();
    }

    watch(() => booking.value.term, (newValue) => {
        // if the new value is not empty
        if (newValue) {
            booking.value.superhero = superheroes.value[0];
        } else {
            booking.value.superhero = "";
        }
    });
});
</script>

<template>
    <main>
        <form v-if="route.name != 'view-booking'" class="container my-5" @submit.prevent="submitBooking">
            <div class="row mb-3">
                <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="inputEmail3" v-model="booking.email" required>
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-2 col-form-label">Number of Tickets</label>
                <div class="col-sm-10">
                    <input type="number" class="form-control" id="inputPassword3" v-model="booking.noOfTicket" min="1"
                        max="4">
                </div>
            </div>
            <fieldset class="row mb-3">
                <legend class="col-form-label col-sm-2 pt-0">Radios</legend>
                <div class="col-sm-10">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="booking.gridRadios" id="gridRadios1"
                            value="creditcard" checked>
                        <label class="form-check-label" for="gridRadios1">
                            Pay with Credit Card
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="booking.gridRadios" id="gridRadios2"
                            value="paypal">
                        <label class="form-check-label" for="gridRadios2">
                            Pay with Paypal
                        </label>
                    </div>
                    <div class="form-check disabled">
                        <input class="form-check-input" type="radio" v-model="booking.gridRadios" id="gridRadios3"
                            value="octopus" disabled>
                        <label class="form-check-label" for="gridRadios3">
                            Pay with Octopus
                        </label>
                    </div>
                </div>
            </fieldset>

            <div class="row mb-3">
                <label class="col-sm-2 col-form-label">Favourite Team</label>
                <select class="form-select" aria-label="Default select example" v-model="booking.term">
                    <option value="" selected>Open this select menu</option>
                    <option value="Avengers">Avengers</option>
                    <option value="JLA">Justice League</option>
                </select>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label">Favourite Hero</label>
                <select class="form-select" aria-label="Default select example" v-model="booking.superhero" :disabled="!booking.term">
                    <option v-for="superhero in superheroes" :key="superhero" :value="superhero"> {{ superhero }} </option>
                </select>
            </div>
            <div class="row mb-3">
                <div class="col-sm-10 offset-sm-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="gridCheck1" v-model="booking.terms">
                        <label class="form-check-label" for="gridCheck1">
                            Agree to terms and conditions
                        </label>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Buy Tickets</button>
            <button type="button" class="btn btn-danger" v-if="route.name == 'update-booking'" v-on:click="deleteBooking">Delete</button>
        </form>


        <div v-if="route.name == 'view-booking'">
    <h1>{{ booking.email }}</h1>
    <p>Number of Tickets: {{ booking.noOfTicket }}</p>
    <p>Payment Method: {{ booking.gridRadios }}</p>
    <p>Favourite Team: {{ booking.term }}</p>
    <p>Favourite Hero: {{ booking.superhero }}</p>
    <p>Terms and Conditions: {{ booking.terms }}</p>
</div>
    </main>
</template>

