import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit{

  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    let sidenav = document.getElementById("sidenav");
    if(sidenav){
      sidenav.remove();
    }
  }

  routerActive: string = "activelink";

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/designer/home",
      icon: "home",
      menu: "Home",
    },
    {
      link: "/designer/button",
      icon: "disc",
      menu: "Buttons",
    },
    {
      link: "/designer/forms",
      icon: "layout",
      menu: "Forms",
    },
    {
      link: "/designer/alerts",
      icon: "info",
      menu: "Alerts",
    },
    {
      link: "/designer/grid-list",
      icon: "file-text",
      menu: "Grid List",
    },
    {
      link: "/designer/menu",
      icon: "menu",
      menu: "Menus",
    },
    {
      link: "/designer/table",
      icon: "grid",
      menu: "Tables",
    },
    {
      link: "/designer/expansion",
      icon: "divide-circle",
      menu: "Expansion Panel",
    },
    {
      link: "/designer/chips",
      icon: "award",
      menu: "Chips",
    },
    {
      link: "/designer/tabs",
      icon: "list",
      menu: "Tabs",
    },
    {
      link: "/designer/progress",
      icon: "bar-chart-2",
      menu: "Progress Bar",
    },
    {
      link: "/designer/toolbar",
      icon: "voicemail",
      menu: "Toolbar",
    },
    {
      link: "/designer/progress-snipper",
      icon: "loader",
      menu: "Progress Snipper",
    },
    {
      link: "/designer/tooltip",
      icon: "bell",
      menu: "Tooltip",
    },
    {
      link: "/designer/snackbar",
      icon: "slack",
      menu: "Snackbar",
    },
    {
      link: "/designer/slider",
      icon: "sliders",
      menu: "Slider",
    },
    {
      link: "/designer/slide-toggle",
      icon: "layers",
      menu: "Slide Toggle",
    },
    {
      link: "/dashboard",
      icon: "corner-down-left",
      menu: "Return",
    },
  ]

}
