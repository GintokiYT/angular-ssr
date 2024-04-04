import { Component, Inject, PLATFORM_ID, signal, HostListener } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ButtonComponent, IconComponent } from '@geor360/base-components';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  character: any;
  statusAuthenticated = signal<boolean>(false);
  statusMenu = signal<boolean>(false);
  statusDropdown = signal<boolean>(false);
  width = signal<number>(0);

  constructor(
    private title: Title,
    @Inject(Meta) private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dataSvc: DataService,
  ) {
    this.dataSvc.getCharacter().subscribe(character => {
      this.character = character;
      this.title.setTitle(`Geor Marketplace${character.name.slice(0,0)}`);
      this.meta.updateTag({
        name: 'description',
        content: `Geor Marketplace${character.name.slice(0,0)}`
      });
    });
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const value: number = document.body.clientWidth;
    this.width.set(value);

    if(this.width() >= 1000) {
      document.body.classList.remove('overflow-hidden');
      this.statusMenu.set(false);
    }

    const avatar: DOMRect = document.querySelector(`${this.width() >= 1000 ? '#avatar-desktop' : '#avatar-mobile'}`)!.getBoundingClientRect();
    document.documentElement.style.setProperty('--dropdownX', `${avatar.left}px`);
    document.documentElement.style.setProperty('--dropdownY', `${avatar.top}px`);
  }

  ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)) {
      const value: number = document.body.clientWidth;
      this.width.set(value);
    }
  }

  toggleMenu() {
    this.statusMenu.update((currentValue) => !currentValue);

    if(this.statusMenu()) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  showInfo(event: any) {
    document.body.classList.add('overflow-hidden');
    this.statusDropdown.set(true);
    const avatar: DOMRect = event.target!.getBoundingClientRect()
    document.documentElement.style.setProperty('--dropdownX', `${avatar.left}px`)
    document.documentElement.style.setProperty('--dropdownY', `${avatar.top}px`);

    const dropdownMenuItem: HTMLDivElement = document.querySelector('#dropdown-menu-item')!;
    dropdownMenuItem.style.translate = `calc(var(--dropdownX) - (246px - 32px)) calc(var(--dropdownY) + 40px)`;
  }

  closeDropdownMenu(event: any) {
    if(event.target === document.querySelector('.dropdown-menu')) {
      this.statusDropdown.set(false);
      document.body.classList.remove('overflow-hidden');
    }
  }

  logIn() {
    this.statusAuthenticated.set(true);
  }

  logOut() {
    this.statusAuthenticated.set(false);
    this.statusDropdown.set(false);
    document.body.classList.remove('overflow-hidden');
  }
}
