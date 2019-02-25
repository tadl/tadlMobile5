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
  { path: 'card', loadChildren: './card/card.module#CardPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
