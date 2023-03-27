import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-contact-us-text1',
  templateUrl: './search-contact-us-text1.component.html',
  styleUrls: ['./search-contact-us-text1.component.scss']
})
export class SearchContactUsText1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  coFyndAdvantages = [
    {
      icon: 'home/work-spaces.svg',
      title: '100,000+ Spaces',
      description: 'Get access to 100,000+ spaces with easy availability and convenience anytime and anywhere. Space Search Made Simple with CoFynd',
    },
    {
      icon: 'icons/brokerage-icon.svg',
      title: 'Zero Brokerage',
      description: "CoFynd is India’s fastest growing space discovery platform that doesn’t charge any brokerage from the customers.",
    },
    {
      icon: 'home/support.svg',
      title: '100% Offline Support',
      description: 'We provide complete offline support from choosing the best space, scheduling site visits, bookings and after sales.',
    },
  ];

}
