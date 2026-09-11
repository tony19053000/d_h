import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Indian Luxury Hotels & Resorts (Goa, Kerala, Udaipur, Jaipur, Shimla, etc.) and 30 customer profiles...');

  // Clean existing data in reverse order of cascade dependencies
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // Seed 30 Customers
  const customerData = [
    { id: 'user_alice', name: 'Alice Chen', email: 'alice.chen@example.com', avatar: 'https://picsum.photos/id/64/150/150' },
    { id: 'user_bob', name: 'Bob Kumar', email: 'bob.kumar@example.com', avatar: 'https://picsum.photos/id/91/150/150' },
    { id: 'user_eleanor', name: 'Eleanor Vance', email: 'eleanor.vance@example.com', avatar: 'https://picsum.photos/id/1027/150/150' },
    { id: 'user_david', name: 'David Miller', email: 'david.miller@example.com', avatar: 'https://picsum.photos/id/1005/150/150' },
    { id: 'user_sophia', name: 'Sophia Rodriguez', email: 'sophia.rodriguez@example.com', avatar: 'https://picsum.photos/id/1011/150/150' },
    { id: 'user_liam', name: 'Liam Wilson', email: 'liam.wilson@example.com', avatar: 'https://picsum.photos/id/1012/150/150' },
    { id: 'user_olivia', name: 'Olivia Taylor', email: 'olivia.taylor@example.com', avatar: 'https://picsum.photos/id/1013/150/150' },
    { id: 'user_noah', name: 'Noah Anderson', email: 'noah.anderson@example.com', avatar: 'https://picsum.photos/id/1014/150/150' },
    { id: 'user_emma', name: 'Emma Thomas', email: 'emma.thomas@example.com', avatar: 'https://picsum.photos/id/1025/150/150' },
    { id: 'user_james', name: 'James Jackson', email: 'james.jackson@example.com', avatar: 'https://picsum.photos/id/1026/150/150' },
    { id: 'user_ava', name: 'Ava White', email: 'ava.white@example.com', avatar: 'https://picsum.photos/id/1028/150/150' },
    { id: 'user_benjamin', name: 'Benjamin Harris', email: 'benjamin.harris@example.com', avatar: 'https://picsum.photos/id/1033/150/150' },
    { id: 'user_isabella', name: 'Isabella Martin', email: 'isabella.martin@example.com', avatar: 'https://picsum.photos/id/1035/150/150' },
    { id: 'user_lucas', name: 'Lucas Thompson', email: 'lucas.thompson@example.com', avatar: 'https://picsum.photos/id/1040/150/150' },
    { id: 'user_mia', name: 'Mia Garcia', email: 'mia.garcia@example.com', avatar: 'https://picsum.photos/id/1062/150/150' },
    { id: 'user_henry', name: 'Henry Martinez', email: 'henry.martinez@example.com', avatar: 'https://picsum.photos/id/1069/150/150' },
    { id: 'user_charlotte', name: 'Charlotte Robinson', email: 'charlotte.robinson@example.com', avatar: 'https://picsum.photos/id/1074/150/150' },
    { id: 'user_alexander', name: 'Alexander Clark', email: 'alexander.clark@example.com', avatar: 'https://picsum.photos/id/1080/150/150' },
    { id: 'user_amelia', name: 'Amelia Rodriguez', email: 'amelia.rodriguez@example.com', avatar: 'https://picsum.photos/id/1084/150/150' },
    { id: 'user_sebastian', name: 'Sebastian Lewis', email: 'sebastian.lewis@example.com', avatar: 'https://picsum.photos/id/1082/150/150' },
    { id: 'user_harper', name: 'Harper Lee', email: 'harper.lee@example.com', avatar: 'https://picsum.photos/id/1050/150/150' },
    { id: 'user_jack', name: 'Jack Walker', email: 'jack.walker@example.com', avatar: 'https://picsum.photos/id/1054/150/150' },
    { id: 'user_evelyn', name: 'Evelyn Hall', email: 'evelyn.hall@example.com', avatar: 'https://picsum.photos/id/1059/150/150' },
    { id: 'user_owen', name: 'Owen Allen', email: 'owen.allen@example.com', avatar: 'https://picsum.photos/id/1060/150/150' },
    { id: 'user_abigail', name: 'Abigail Young', email: 'abigail.young@example.com', avatar: 'https://picsum.photos/id/1066/150/150' },
    { id: 'user_ethan', name: 'Ethan King', email: 'ethan.king@example.com', avatar: 'https://picsum.photos/id/1068/150/150' },
    { id: 'user_emily', name: 'Emily Wright', email: 'emily.wright@example.com', avatar: 'https://picsum.photos/id/1070/150/150' },
    { id: 'user_samuel', name: 'Samuel Scott', email: 'samuel.scott@example.com', avatar: 'https://picsum.photos/id/1072/150/150' },
    { id: 'user_elizabeth', name: 'Elizabeth Green', email: 'elizabeth.green@example.com', avatar: 'https://picsum.photos/id/1076/150/150' },
    { id: 'user_daniel', name: 'Daniel Baker', email: 'daniel.baker@example.com', avatar: 'https://picsum.photos/id/1077/150/150' },
  ];

  for (const c of customerData) {
    await prisma.user.create({
      data: {
        id: c.id,
        name: c.name,
        email: c.email,
        password: 'password123',
        avatar: c.avatar,
      },
    });
  }
  console.log(`Successfully seeded ${customerData.length} customer accounts.`);

  // Seed Premier Indian Hotels & Resorts (All Locations in India)
  const hotels = [
    {
      id: 'hotel-goa-taj',
      name: 'Taj Fort Aguada Beach Resort & Spa',
      type: 'Beach Resort',
      location: 'Goa, India',
      address: 'Sinquerim Beach, Candolim, Goa 403515, India',
      rating: 4.95,
      image: 'https://picsum.photos/id/1039/1200/800',
      description: 'Iconic luxury beach resort overlooking Arabian Sea waters. Portuguese fort heritage with private beach villas, infinity pool, and sunset deck.',
      amenities: JSON.stringify(['Private Beach Access', 'Infinity Pool', 'Ayurvedic Spa', 'Sunset Deck Dining', 'Water Sports', 'Free High-Speed Wi-Fi']),
    },
    {
      id: 'hotel-goa-alila',
      name: 'Alila Diwa South Goa Palms & Spa',
      type: 'Luxury Resort',
      location: 'Goa, India',
      address: 'Majorda Beach Road, Salcete, Goa 403713, India',
      rating: 4.92,
      image: 'https://picsum.photos/id/1040/1200/800',
      description: 'Lush paddy field sanctuary steps from Majorda Beach. Open-air infinity pool, Goan seafood grills, and private plunge pool villas.',
      amenities: JSON.stringify(['Infinity Pool', 'Private Plunge Pool', 'Paddy Field View', 'Goan Cuisine', 'Spa Wellness', '24/7 Concierge']),
    },
    {
      id: 'hotel-udaipur',
      name: 'Taj Lake Palace Heritage Resort',
      type: 'Heritage Palace',
      location: 'Udaipur, Rajasthan, India',
      address: 'Pichola, Udaipur, Rajasthan 313001, India',
      rating: 4.98,
      image: 'https://picsum.photos/id/1029/1200/800',
      description: 'Floating marble palace on Lake Pichola built in 1746. Royal butler service, lakeside royal dining, and panoramic Aravalli mountain views.',
      amenities: JSON.stringify(['Lake Pichola View', 'Royal Butler Service', 'Jharokha Dining', 'Heritage Spa Boat', 'Royal Welcome']),
    },
    {
      id: 'hotel-kerala',
      name: 'Kumarakom Backwater Lake Sanctuary',
      type: 'Backwater Resort',
      location: 'Kumarakom, Kerala, India',
      address: 'Vembanad Lake, Kumarakom, Kerala 686563, India',
      rating: 4.91,
      image: 'https://picsum.photos/id/1043/1200/800',
      description: 'Sprawling backwater retreat along Vembanad Lake. Private pool villas, traditional houseboat cruises, and authentic Kerala Ayurveda.',
      amenities: JSON.stringify(['Private Houseboat Cruise', 'Ayurvedic Spa', 'Private Pool Villa', 'Vembanad Lake View', 'Organic Seafood']),
    },
    {
      id: 'hotel-jaipur',
      name: 'Rambagh Palace Royal Residence',
      type: 'Heritage Palace',
      location: 'Jaipur, Rajasthan, India',
      address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005, India',
      rating: 4.97,
      image: 'https://picsum.photos/id/1015/1200/800',
      description: 'The Jewel of Jaipur. Former residence of the Maharaja with manicured peacock gardens, royal suites, and Polo Bar.',
      amenities: JSON.stringify(['Royal Gardens', 'Polo Bar', 'Indoor & Outdoor Pool', 'Royal Spa', 'Fine Dining']),
    },
    {
      id: 'hotel-shimla',
      name: 'Wildflower Hall Alpine Sanctuary',
      type: 'Mountain Resort',
      location: 'Shimla, Himachal Pradesh, India',
      address: 'Chharabra, Shimla, Himachal Pradesh 171012, India',
      rating: 4.93,
      image: 'https://picsum.photos/id/1036/1200/800',
      description: 'Situated 8,250 feet above sea level surrounded by pine forests. Heated outdoor infinity whirlpool overlooking snow-capped Himalayas.',
      amenities: JSON.stringify(['Himalaya View', 'Heated Outdoor Whirlpool', 'Pine Forest Trails', 'Fireplace Suites', 'Spa Retreat']),
    },
    {
      id: 'hotel-mumbai',
      name: 'The Taj Mahal Palace & Towers',
      type: 'Luxury Hotel',
      location: 'Mumbai, Maharashtra, India',
      address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India',
      rating: 4.96,
      image: 'https://picsum.photos/id/1048/1200/800',
      description: 'Legendary 1903 landmark hotel overlooking Gateway of India and Arabian Sea harbor. World-class luxury, chef restaurants, and harbor views.',
      amenities: JSON.stringify(['Harbor Sea View', 'Gateway of India View', 'Chef Restaurants', 'Luxury Shopping Arcade', 'Butler Service']),
    },
    {
      id: 'hotel-andaman',
      name: 'Barefoot Coral Cove Island Resort',
      type: 'Island Resort',
      location: 'Havelock Island, Andaman & Nicobar, India',
      address: 'Beach No. 7, Radhanagar Beach, Havelock Island 744211, India',
      rating: 4.94,
      image: 'https://picsum.photos/id/1050/1200/800',
      description: 'Eco-luxury rainforest cottages right on Asia’s best Radhanagar Beach. Scuba diving with sea turtles, bioluminescent kayaking, and white sand.',
      amenities: JSON.stringify(['Radhanagar Beach', 'Scuba Diving', 'Rainforest Cottages', 'Seafood Grill', 'Bioluminescent Tour']),
    },
  ];

  for (const h of hotels) {
    await prisma.hotel.create({ data: h });
  }
  console.log(`Seeded ${hotels.length} luxury Indian hotels & resorts.`);

  // Seed 32 Large Inventory of Rooms across all Indian Resorts
  const rooms = [
    // GOA ROOMS (Resort 1 & 2)
    {
      id: 'room-goa-1',
      hotelId: 'hotel-goa-taj',
      name: 'Fort Sea-View Royal Villa',
      description: 'Exclusive Portuguese heritage villa on Arabian Sea cliffside with private garden patio, outdoor Jacuzzi, and personal butler.',
      price: 450,
      capacity: 2,
      amenities: JSON.stringify(['Arabian Sea View', 'King Bed', 'Free Wi-Fi', 'Private Garden', 'Jacuzzi', 'Breakfast Included']),
      images: JSON.stringify(['https://picsum.photos/id/1039/1200/800', 'https://picsum.photos/id/1025/1200/800']),
      featured: true,
      sizeSqFt: 750,
      bedType: '1 King Bed',
      rating: 4.95,
    },
    {
      id: 'room-goa-2',
      hotelId: 'hotel-goa-taj',
      name: 'Candolim Sunset Plunge Pool Suite',
      description: 'Spacious oceanfront suite with private terrace infinity plunge pool, sun lounges, and evening sundowner service.',
      price: 650,
      capacity: 4,
      amenities: JSON.stringify(['Private Plunge Pool', 'Ocean View', 'Free Wi-Fi', 'Butler Service', 'Spa Access']),
      images: JSON.stringify(['https://picsum.photos/id/1040/1200/800', 'https://picsum.photos/id/1029/1200/800']),
      featured: true,
      sizeSqFt: 1100,
      bedType: '2 King Beds',
      rating: 5.0,
    },
    {
      id: 'room-goa-3',
      hotelId: 'hotel-goa-taj',
      name: 'Aguada Beach Bungalow',
      description: 'Steps away from powdery golden sand. Features outdoor rain shower, teak veranda, and sea breeze lounge.',
      price: 320,
      capacity: 2,
      amenities: JSON.stringify(['Direct Beach Access', 'Rain Shower', 'Free Wi-Fi', 'Breakfast Included']),
      images: JSON.stringify(['https://picsum.photos/id/1062/1200/800', 'https://picsum.photos/id/1069/1200/800']),
      featured: false,
      sizeSqFt: 580,
      bedType: '1 King Bed',
      rating: 4.8,
    },
    {
      id: 'room-goa-4',
      hotelId: 'hotel-goa-alila',
      name: 'Diwa Private Pool Villa',
      description: 'Secluded South Goa luxury villa surrounded by palm trees and paddy fields. Features private 40ft pool and open sun deck.',
      price: 580,
      capacity: 4,
      amenities: JSON.stringify(['Private Pool', 'Paddy Field View', 'Free Wi-Fi', 'Kitchenette', 'Butler Service']),
      images: JSON.stringify(['https://picsum.photos/id/1037/1200/800', 'https://picsum.photos/id/1035/1200/800']),
      featured: true,
      sizeSqFt: 1250,
      bedType: '2 King Beds',
      rating: 4.92,
    },
    {
      id: 'room-goa-5',
      hotelId: 'hotel-goa-alila',
      name: 'Majorda Courtyard Deluxe Room',
      description: 'Elegantly furnished room overlooking serene lotus pond courtyard with private sun balcony.',
      price: 250,
      capacity: 2,
      amenities: JSON.stringify(['Lotus Pond View', 'Free Wi-Fi', 'Balcony', 'Breakfast Included']),
      images: JSON.stringify(['https://picsum.photos/id/1043/1200/800', 'https://picsum.photos/id/1044/1200/800']),
      featured: false,
      sizeSqFt: 480,
      bedType: '1 King Bed',
      rating: 4.75,
    },

    // UDAIPUR ROOMS
    {
      id: 'room-udaipur-1',
      hotelId: 'hotel-udaipur',
      name: 'Grand Royal Lake Palace Suite',
      description: 'Historic royal suite with carved marble archways, silk tapestry, Lake Pichola panoramas, and private royal butler.',
      price: 880,
      capacity: 2,
      amenities: JSON.stringify(['Lake Pichola View', 'Royal Butler', 'Marble Tub', 'Free Wi-Fi', 'Royal Welcome']),
      images: JSON.stringify(['https://picsum.photos/id/1029/1200/800', 'https://picsum.photos/id/1015/1200/800']),
      featured: true,
      sizeSqFt: 950,
      bedType: '1 Royal King Bed',
      rating: 4.99,
    },
    {
      id: 'room-udaipur-2',
      hotelId: 'hotel-udaipur',
      name: 'Mewar Jharokha Terrace Chamber',
      description: 'Lakeside chamber featuring traditional Rajasthani Jharokha balcony seat floating directly above the lake waters.',
      price: 620,
      capacity: 2,
      amenities: JSON.stringify(['Jharokha Balcony', 'Lake View', 'Free Wi-Fi', 'Breakfast Included']),
      images: JSON.stringify(['https://picsum.photos/id/1018/1200/800', 'https://picsum.photos/id/1020/1200/800']),
      featured: false,
      sizeSqFt: 700,
      bedType: '1 King Bed',
      rating: 4.9,
    },

    // KERALA ROOMS
    {
      id: 'room-kerala-1',
      hotelId: 'hotel-kerala',
      name: 'Vembanad Backwater Pool Villa',
      description: 'Private Kerala villa with personal lap pool, outdoor garden rain bath, and private jetty for sunset boat cruises.',
      price: 520,
      capacity: 4,
      amenities: JSON.stringify(['Private Lap Pool', 'Backwater View', 'Rain Bath', 'Free Wi-Fi', 'Ayurvedic Breakfast']),
      images: JSON.stringify(['https://picsum.photos/id/1043/1200/800', 'https://picsum.photos/id/1050/1200/800']),
      featured: true,
      sizeSqFt: 1150,
      bedType: '2 King Beds',
      rating: 4.93,
    },
    {
      id: 'room-kerala-2',
      hotelId: 'hotel-kerala',
      name: 'Traditional Heritage Wooden Heritage Suite',
      description: '150-year-old preserved teak wood Illam suite overlooking tranquil lily channels.',
      price: 340,
      capacity: 2,
      amenities: JSON.stringify(['Teak Wood Architecture', 'Lily Channel View', 'Free Wi-Fi', 'Ayurvedic Massage Included']),
      images: JSON.stringify(['https://picsum.photos/id/1054/1200/800', 'https://picsum.photos/id/1060/1200/800']),
      featured: false,
      sizeSqFt: 620,
      bedType: '1 King Bed',
      rating: 4.85,
    },

    // JAIPUR ROOMS
    {
      id: 'room-jaipur-1',
      hotelId: 'hotel-jaipur',
      name: 'Maharani Royal Garden Suite',
      description: 'Opulent suite with gold leaf frescoes, private peacock garden courtyard, and brass clawfoot soaking tub.',
      price: 790,
      capacity: 3,
      amenities: JSON.stringify(['Peacock Garden View', 'Clawfoot Tub', 'Free Wi-Fi', 'Polo Bar Access']),
      images: JSON.stringify(['https://picsum.photos/id/1048/1200/800', 'https://picsum.photos/id/1049/1200/800']),
      featured: true,
      sizeSqFt: 1050,
      bedType: '1 Royal King Bed',
      rating: 4.96,
    },

    // SHIMLA ROOMS
    {
      id: 'room-shimla-1',
      hotelId: 'hotel-shimla',
      name: 'Himalayan Ridge Fireplace Chalet',
      description: 'Cedar wood mountain suite with stone fireplace, heated floor marble bath, and panoramic snowy Himalaya views.',
      price: 490,
      capacity: 3,
      amenities: JSON.stringify(['Himalaya View', 'Wood Fireplace', 'Heated Bathroom', 'Free Wi-Fi']),
      images: JSON.stringify(['https://picsum.photos/id/1036/1200/800', 'https://picsum.photos/id/1038/1200/800']),
      featured: true,
      sizeSqFt: 850,
      bedType: '1 King Bed + 1 Daybed',
      rating: 4.91,
    },

    // MUMBAI ROOMS
    {
      id: 'room-mumbai-1',
      hotelId: 'hotel-mumbai',
      name: 'Gateway Harbor Sea View Suite',
      description: 'Iconic grand suite overlooking the Gateway of India monument and Arabian Sea with 24/7 butler service.',
      price: 710,
      capacity: 2,
      amenities: JSON.stringify(['Gateway & Sea View', '24/7 Butler', 'High-Speed Wi-Fi', 'Executive Lounge']),
      images: JSON.stringify(['https://picsum.photos/id/1015/1200/800', 'https://picsum.photos/id/1016/1200/800']),
      featured: true,
      sizeSqFt: 800,
      bedType: '1 King Bed',
      rating: 4.97,
    },

    // ANDAMAN ROOMS
    {
      id: 'room-andaman-1',
      hotelId: 'hotel-andaman',
      name: 'Radhanagar Ocean Beachfront Villa',
      description: 'Direct step-out access to white sands of Radhanagar Beach. Features outdoor rain shower, hammock, and ocean view deck.',
      price: 540,
      capacity: 3,
      amenities: JSON.stringify(['Direct Beach Access', 'Rain Shower', 'Ocean View', 'Free Wi-Fi', 'Scuba Gear Included']),
      images: JSON.stringify(['https://picsum.photos/id/1050/1200/800', 'https://picsum.photos/id/1074/1200/800']),
      featured: true,
      sizeSqFt: 920,
      bedType: '1 King Bed',
      rating: 4.94,
    },
  ];

  for (const r of rooms) {
    await prisma.room.create({ data: r });
  }
  console.log(`Seeded ${rooms.length} luxury rooms across Indian destinations.`);

  // Seed ONLY 1 Reservation for testing "booked/unavailable" on 1 room (`room-goa-1` for Sep 15 - Sep 18)
  // All other rooms are 100% available!
  await prisma.reservation.create({
    data: {
      id: 'res_alice_goa_test',
      roomId: 'room-goa-1',
      userId: 'user_alice',
      guestName: 'Alice Chen',
      guestEmail: 'alice.chen@example.com',
      checkIn: '2026-09-15',
      checkOut: '2026-09-18',
      guests: 2,
      totalNights: 3,
      pricePerNight: 450,
      totalPrice: 1350,
      status: 'CONFIRMED',
    },
  });

  console.log('Seeding successfully completed! Only 1 room is reserved for test dates (Sep 15-18), all other rooms are 100% available!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
