import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { RestaurantRegisComponent } from './restaurant-regis/restaurant-regis.component';
import { CustRegisComponent } from './cust-regis/cust-regis.component';
import { LoginComponent } from './login/login.component';
import { AdminViewRestaurantComponent } from './admin-view-restaurant/admin-view-restaurant.component';
import { AdminUpdateRestaurantComponent } from './admin-update-restaurant/admin-update-restaurant.component';
import { AdminViewCustomerComponent } from './admin-view-customer/admin-view-customer.component';
import { AdminUpdateCustomerComponent } from './admin-update-customer/admin-update-customer.component';
import { RestViewPizzaComponent } from './rest-view-pizza/rest-view-pizza.component';
import { RestAddPizzaComponent } from './rest-add-pizza/rest-add-pizza.component';
import { RestUpdatePizzaComponent } from './rest-update-pizza/rest-update-pizza.component';
import { AdminAddCategoryComponent } from './admin-add-category/admin-add-category.component';
import { CustViewPizzaComponent } from './cust-view-pizza/cust-view-pizza.component';
import { CustCartComponent } from './cust-cart/cust-cart.component';
import { CustViewParcelComponent } from './cust-view-parcel/cust-view-parcel.component';

import { CustSelectRestComponent } from './cust-select-rest/cust-select-rest.component';
import { RestNewOrderViewComponent } from './rest-new-order-view/rest-new-order-view.component';



export const routes: Routes = [
    {path:"",component: HomeComponent},
    {path:"about",component: AboutComponent},
    {path:"contact",component: ContactComponent},
    {path:"rest_regis",component: RestaurantRegisComponent},
    {path:"cust_regis",component: CustRegisComponent},
    {path:"login",component: LoginComponent},
    {path:"admin_view_restaurant",component: AdminViewRestaurantComponent},
    {path:"admin_update_restaurant/:rid",component: AdminUpdateRestaurantComponent},
    {path:"admin_view_customer",component: AdminViewCustomerComponent},
    {path:"admin_update_customer/:cid",component: AdminUpdateCustomerComponent},
    {path:"rest_view_pizza",component: RestViewPizzaComponent},
    {path:"rest_add_pizza",component: RestAddPizzaComponent},
    {path:"rest_update_pizza/:pid",component: RestUpdatePizzaComponent},
    {path:"cust_select_rest",component: CustSelectRestComponent},
    {path:"admin_add_category",component: AdminAddCategoryComponent},
    {path:"cust_view_pizza",component: CustViewPizzaComponent},
    {path:"cust_cart",component: CustCartComponent},
    {path:"cust_view_parcel",component: CustViewParcelComponent},
    {path:"cust_view_all_orders",component: CustViewParcelComponent},
    {path:"rest_new_order_view",component: RestNewOrderViewComponent},
];
