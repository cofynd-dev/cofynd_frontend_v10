import { environment } from '@env/environment';

export const DEFAULT_APP_DATA = {
  contact: {
    phone: '+91 9999 10 8078',
    email: 'hello@cofynd.com',
    address: '1st Floor, Landmark Cyber Park, Sector 67, Gurugram, Haryana 122018',
  },
  header_contact: {
    phone: '+91 9999 10 8078',
    email: 'live@cofynd.com',
    address: '1st Floor, Landmark Cyber Park, Sector 67, Gurugram, Haryana 122018',
  },
  socialLinks: [
    {
      url: 'https://www.facebook.com/cofynd/',
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
    },
    {
      url: 'https://www.instagram.com/cofynd/',
      name: 'Instagram',
      icon: 'fab fa-instagram',
    },
    {
      url: 'https://www.linkedin.com/company/cofynd1/',
      name: 'Linkedin',
      icon: 'fab fa-linkedin-in',
    },
    {
      url: 'https://twitter.com/CoFynd',
      name: 'Twitter',
      icon: 'fab fa-twitter',
    },
  ],

  footerLinks: [
    // {
    //   name: 'Spaces on Golf Course Road',
    //   city: 'gurugram',
    //   slug: 'golf-course-road',
    // },
    // {
    //   name: 'Spaces in DLF Cyber City',
    //   city: 'gurugram',
    //   slug: 'dlf-cyber-city',
    // },
    // {
    //   name: 'Spaces in Udyog Vihar',
    //   city: 'gurugram',
    //   slug: 'udyog-vihar-gurugram',
    // },
    // {
    //   name: 'Spaces in Saket',
    //   city: 'delhi',
    //   slug: 'saket-delhi',
    // },
    // {
    //   name: 'Spaces in Connaught Place',
    //   city: 'delhi',
    //   slug: 'connaught-place',
    // },
  ],

  footerCoworkingLinks: [
    {
      name: 'Coworking Space in Gurgaon',
      city: 'gurugram',
    },
    {
      name: 'Coworking Space in Delhi',
      city: 'delhi',
    },
    {
      name: 'Coworking Space in Noida',
      city: 'noida',
    },
    {
      name: 'Coworking Space in Bangalore',
      city: 'bangalore',
    },
    {
      name: 'Coworking Space in Hyderabad',
      city: 'hyderabad',
    },
    {
      name: 'Coworking Space in Pune',
      city: 'pune',
    },
    {
      name: 'Coworking Space in Mumbai',
      city: 'mumbai',
    },
  ],

  footerOfficeLinks: [
    {
      name: 'Office Space for rent in Gurgaon',
      city: 'gurugram',
    },
    {
      name: 'Office Space for rent in Delhi',
      city: 'delhi',
    },
    {
      name: 'Office Space for rent in Noida',
      city: 'noida',
    },
    {
      name: 'Office Space for rent in Bangalore',
      city: 'bangalore',
    },
    {
      name: 'Office Space for rent in Hyderabad',
      city: 'hyderabad',
    },
    {
      name: 'Office Space for rent in Pune',
      city: 'pune',
    },
    {
      name: 'Office Space for rent in Mumbai',
      city: 'mumbai',
    },
  ],

  footerColivingLinks: [
    {
      name: 'Coliving Space in Gurgaon',
      city: 'gurugram',
    },
    {
      name: 'Coliving Space in Delhi',
      city: 'delhi',
    },
    {
      name: 'Coliving Space in Noida',
      city: 'noida',
    },
    {
      name: 'Coliving Space in Bangalore',
      city: 'bangalore',
    },
    {
      name: 'Coliving Space in Hyderabad',
      city: 'hyderabad',
    },
    {
      name: 'Coliving Space in Pune',
      city: 'pune',
    },
    {
      name: 'Coliving Space in Mumbai',
      city: 'mumbai',
    },
  ],

  marketing: {
    coworking: [
      {
        url: '/coworking-space-gurgaon',
        location: 'Gurgaon',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify">CoFynd is India's fastest growing online discovery platform for
        searching and booking the best coworking spaces in Bangalore. Our spaces boast of
        present-day amenities and reflect Freedom, Flexibility and Fulfillment completely in
        sync with the modern-day millennial behaviour.</p>

        <p class="text-justify">CoFynd gives you access to all the popular coworking locations
          of Bangalore- Koramangala, Indiranagar, HSR Layout, Whitefield, JP Nagar, Electronic
          City and lot more.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a
          coworking space plan for you. If you need access to coworking space in Bangalore for
          a day, then you can book a Day Pass. For longer periods, you can go ahead with
          dedicated desks or private cabins. Hot Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for
          larger teams in their own reception, Customized Office Spaces for CEO's, CXO's and
          the Custom Built Offices as per your requirements. Be a part of the biggest
          co-working community in Bangalore and meet like-minded entrepreneurs and
          individuals. You are just a step away from the best coworking spaces in Bangalore.
        </p>`,
        seoData: {
          title: 'Coworking Space in Gurgaon | Best Shared Office Space in Gurgaon',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description:
            'CoFynd - Rent a Perfect Coworking space in Gurgaon at the best price with no-lockin, no-leasing. Team plan offers available.',
          url: environment.appUrl + '/coworking-space-gurgaon',
          type: 'website',
        },
      },
      {
        url: '/coworking-space-delhi',
        location: 'Delhi',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify"CoFynd is India's fastest growing online discovery platform for 
        searching and booking the best coworking spaces in Delhi. Our spaces boast of 
        present-day amenities and reflect Freedom, Flexibility and Fulfillment completely in 
        sync with the modern-day millennial behaviour.</p>

        <p class="text-justify">CoFynd gives you access to all the popular coworking locations 
          of Delhi- Connaught Place, Dwarka, South Delhi, Nehru Place, Netaji Subhash Place, Janakpuri, 
          Aerocity, Okhla, Rohini, Saket and more.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a
        coworking space plan for you. If you need access to coworking space in Delhi for a day, 
        then you can book a Day Pass. For longer periods, you can go ahead with dedicated desks or 
        private cabins. Hot Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for larger 
          teams in their own reception, Customized Office Spaces for CEO's, CXO's and the Custom Built 
          Offices as per your requirements. Be a part of the biggest co-working community in Delhi and 
          meet like-minded entrepreneurs and individuals. You are just a step away from the best coworking 
          spaces in Delhi.</p>`,
        seoData: {
          title: 'Coworking Space in Delhi | Best Shared Office Space in Delhi',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description: `Book the best coworking space in Delhi by easily comparing the price,
            amenities & accessibility of our 200+ verified shared office spaces with NO LEASE, NO
            LOCKIN.
            `,
          url: environment.appUrl + '/coworking-space-delhi',
          type: 'website',
        },
      },
      {
        url: '/coworking-space-noida',
        location: 'Noida',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify"CoFynd is India's fastest growing online discovery platform for 
        searching and booking the best coworking spaces in Noida. Our spaces boast of 
        present-day amenities and reflect Freedom, Flexibility and Fulfillment completely in 
        sync with the modern-day millennial behaviour.</p>

        <p class="text-justify">CoFynd gives you access to all the popular coworking locations of
        Noida- Sector-1, Sector-2, Sector-62, Sector-63, Sector-59, Sector-16, Noida Expressway, 
        Greater Noida and more.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a coworking
        space plan for you. If you need access to coworking space in Noida for a day, then you can
        book a Day Pass. For longer periods, you can go ahead with dedicated desks or 
        private cabins. Hot Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for larger
        teams in their own reception, Customized Office Spaces for CEO's, CXO's and the Custom 
        Built Offices as per your requirements. Be a part of the biggest co-working community 
        in Noida and meet like-minded entrepreneurs and individuals. You are just a step away 
        from the best coworking spaces in Noida.</p>`,
        seoData: {
          title: 'Coworking Space in Noida | Best Shared Office Space in Noida',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description: `Book the best coworking space in Noida by easily comparing the price,
          amenities & accessibility of our 200+ verified shared office spaces with NO LEASE, NO
          LOCKIN.`,
          url: environment.appUrl + '/coworking-space-noida',
          type: 'website',
        },
      },
      {
        url: '/coworking-space-bangalore',
        location: 'Bangalore',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify"CoFynd is India's fastest growing online discovery platform for 
        searching and booking the best coworking spaces in Bangalore. Our spaces boast of 
        present-day amenities and reflect Freedom, Flexibility and Fulfillment completely in 
        sync with the modern-day millennial behaviour.</p>

        <p class="text-justify">CoFynd gives you access to all the popular coworking locations of
        Bangalore- Koramangala, Indiranagar, HSR Layout, Whitefield, JP Nagar, Electronic City and lot more.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a coworking
        space plan for you. If you need access to coworking space in Bangalore for a day, then you can
        book a Day Pass. For longer periods, you can go ahead with dedicated desks or 
        private cabins. Hot Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for larger
        teams in their own reception, Customized Office Spaces for CEO's, CXO's and the Custom 
        Built Offices as per your requirements. Be a part of the biggest co-working community 
        in Bangalore and meet like-minded entrepreneurs and individuals. You are just a step away 
        from the best coworking spaces in Bangalore.</p>`,
        seoData: {
          title: 'Coworking Space in Bangalore | Best Shared Office Space in Bangalore',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description: `Book the best coworking space in Bangalore by easily comparing the price,
          amenities & accessibility of our 200+ verified shared office spaces with NO LEASE, NO
          LOCKIN.`,
          url: environment.appUrl + '/coworking-space-bangalore',
          type: 'website',
        },
      },
      {
        url: '/coworking-space-hyderabad',
        location: 'Hyderabad',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify"CoFynd is India's fastest growing online discovery platform for 
        searching and booking the best coworking spaces in Hyderabad. Our spaces boast of 
        present-day amenities and reflect Freedom, Flexibility and Fulfillment completely in 
        sync with the modern-day millennial behaviour.</p>

        <p class="text-justify">CoFynd gives you access to all the popular coworking locations of Hyderabad
        - Madhapur, Banjara Hills, Jubilee Hills, Secunderabad, Gachibowli, Hitech City and lot more.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a coworking
        space plan for you. If you need access to coworking space in Hyderabad for a day, then you can
        book a Day Pass. For longer periods, you can go ahead with dedicated desks or 
        private cabins. Hot Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for larger
        teams in their own reception, Customized Office Spaces for CEO's, CXO's and the Custom 
        Built Offices as per your requirements. Be a part of the biggest co-working community 
        in Hyderabad and meet like-minded entrepreneurs and individuals. You are just a step away 
        from the best coworking spaces in Hyderabad.</p>`,
        seoData: {
          title: 'Coworking Space in Hyderabad | Best Shared Office Space in Hyderabad',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description: `Book the best coworking space in Hyderabad by easily comparing the price,
          amenities & accessibility of our 200+ verified shared office spaces with NO LEASE, NO
          LOCKIN.`,
          url: environment.appUrl + '/coworking-space-hyderabad',
          type: 'website',
        },
      },
      {
        url: '/coworking-space-pune',
        location: 'Pune',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify"CoFynd is India's fastest growing online discovery platform for 
        searching and booking the best coworking spaces in Pune. Our spaces boast of 
        present-day amenities and reflect Freedom, Flexibility and Fulfillment completely in 
        sync with the modern-day millennial behaviour.</p>

        <p class="text-justify">CoFynd gives you access to all the popular coworking locations of Pune 
        - Baner, Aundh, Kharadi, Viman Nagar, Wakad, Hinjewadi, Pimple Saudagar and lot more.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a coworking
        space plan for you. If you need access to coworking space in Pune for a day, then you can
        book a Day Pass. For longer periods, you can go ahead with dedicated desks or 
        private cabins. Hot Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for larger
        teams in their own reception, Customized Office Spaces for CEO's, CXO's and the Custom 
        Built Offices as per your requirements. Be a part of the biggest co-working community 
        in Pune and meet like-minded entrepreneurs and individuals. You are just a step away 
        from the best coworking spaces in Pune.</p>`,
        seoData: {
          title: 'Coworking Space in Pune | Best Shared Office Space in Pune',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description: `Book the best coworking space in Pune by easily comparing the price,
          amenities & accessibility of our 200+ verified shared office spaces with NO LEASE, NO
          LOCKIN.`,
          url: environment.appUrl + '/coworking-space-pune',
          type: 'website',
        },
      },
      {
        url: '/coworking-space-mumbai',
        location: 'Mumbai',
        dayPass: '300',
        dedicatedSeat: '5000',
        privateCabin: '20,000',
        virtualOffice: '15,000',
        about: `<p class="text-justify">CoFynd gives you access to all the popular coworking locations of Mumbai- Thane, Navi
        Mumbai, Andheri East, West, Lower Parel, Borivali, Bandra, Mulund, Vashi and the count
        goes on.</p>

        <p class="text-justify">Whether you are a freelancer, startup or an SME, CoFynd has a coworking space plan for
        you. If you need access to coworking space in Mumbai for a day, then you can book a Day
        Pass. For longer periods, you can go ahead with dedicated desks or private cabins. Hot
        Desking options are also available.</p>

        <p class="text-justify">CoFynd also provides enterprise services- Office Suites for larger teams in their own
        reception, Customized Office Spaces for CEO's, CXO's and Custom Built Offices as per your
        requirements. Be a part of the biggest co-working community in Mumbai and meet
        like-minded entrepreneurs and individuals. You are just a step away from the best coworking
        spaces in Mumbai.</p>`,
        seoData: {
          title: 'Coworking Space in Mumbai | Best Shared Office Space in Mumbai',
          image: 'https://cofynd.com/assets/images/marketing/gurugram-banner.png',
          description: `Book the best coworking space in Mumbai by easily comparing the price,
          amenities & accessibility of our 200+ verified shared office spaces with NO LEASE, NO
          LOCKIN.`,
          url: environment.appUrl + '/coworking-space-mumbai',
          type: 'website',
        },
      },
    ],
  },
};
