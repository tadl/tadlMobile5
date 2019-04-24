import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'checkouts', loadChildren: './checkouts/checkouts.module#CheckoutsPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'featured', loadChildren: './featured/featured.module#FeaturedPageModule' },
  { path: 'holds', loadChildren: './holds/holds.module#HoldsPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'locations', loadChildren: './locations/locations.module#LocationsPageModule' },
  { path: 'event-detail', loadChildren: './event-detail/event-detail.module#EventDetailPageModule' },
  { path: 'news-detail', loadChildren: './news-detail/news-detail.module#NewsDetailPageModule' },
  { path: 'item-detail', loadChildren: './item-detail/item-detail.module#ItemDetailPageModule' },
  { path: 'card', loadChildren: './card/card.module#CardPageModule' },
  { path: 'fines', loadChildren: './fines/fines.module#FinesPageModule' },
  { path: 'location-detail', loadChildren: './location-detail/location-detail.module#LocationDetailPageModule' },
  { path: 'checkout-history', loadChildren: './checkout-history/checkout-history.module#CheckoutHistoryPageModule' },
  { path: 'preferences', loadChildren: './preferences/preferences.module#PreferencesPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'password-reset', loadChildren: './password-reset/password-reset.module#PasswordResetPageModule' },
  { path: 'summer', loadChildren: './summer/summer.module#SummerPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
