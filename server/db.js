// In-memory "database"

const DocumentStatus = {
    NOT_UPLOADED: 'doc_not_uploaded',
    PENDING: 'doc_pending',
    APPROVED: 'doc_approved',
    REJECTED: 'doc_rejected',
}

let users = {
    'user1': {
        id: 'user1',
        mobile: '1234567890',
        password: 'password',
        name: 'John Doe',
        type: 'user',
        gender: 'male',
        country: 'India',
        city: 'New Delhi',
        address: '123, Connaught Place, New Delhi',
        addresses: {
            home: '123, Connaught Place, New Delhi',
            work: '456, Cyber Hub, Gurgaon',
        },
    }
};

let drivers = {
    'driver1': {
        id: 'driver1',
        mobile: '1111111111',
        password: 'password',
        name: 'Ravi Kumar',
        type: 'driver',
        photoUrl: 'https://i.pravatar.cc/150?u=driver1',
        rating: 4.8,
        tier: 'gold',
        reviews: [
            { customerName: 'Priya', rating: 5, comment: 'Very professional and helpful!', date: '2024-05-20' },
            { customerName: 'Amit', rating: 4, comment: 'Good service, on time.', date: '2024-05-18' },
        ],
        profile: {
            gender: 'male',
            country: 'India',
            city: 'New Delhi',
            vehicleProfile: {
                pictures: ['https://i.imgur.com/h3aWMAj.png'],
                sizeId: 'mini-truck',
                registrationNumber: 'DL 1A 1234',
                color: 'White',
                make: 'Tata',
                model: 'Ace',
            },
            workingHours: 'Mon-Sat, 9 AM - 7 PM',
            addresses: {
                home: '789, Karol Bagh, New Delhi',
                work: '',
            },
            documents: {
                cnic: { nameKey: 'doc_cnic_name', status: DocumentStatus.APPROVED },
                license: { nameKey: 'doc_license_name', status: DocumentStatus.APPROVED },
                vehicleDocs: { nameKey: 'doc_vehicle_docs_name', status: DocumentStatus.APPROVED },
            },
            loadingTeam: { hasTeam: true, teamSize: 2 },
        }
    },
    'driver2': {
        id: 'driver2',
        mobile: '2222222222',
        password: 'password',
        name: 'Suresh Singh',
        type: 'driver',
        photoUrl: 'https://i.pravatar.cc/150?u=driver2',
        rating: 4.5,
        tier: 'silver',
        reviews: [],
        profile: {
            gender: 'male',
            country: 'India',
            city: 'Gurgaon',
            vehicleProfile: {
                pictures: ['https://i.imgur.com/C5T8j1f.png'],
                sizeId: 'pickup',
                registrationNumber: 'HR 2B 5678',
                color: 'Blue',
                make: 'Mahindra',
                model: 'Bolero Pik-up',
            },
            workingHours: 'Mon-Fri, 10 AM - 6 PM',
            addresses: { home: '45, Sector 29, Gurgaon', work: '' },
            documents: {
                cnic: { nameKey: 'doc_cnic_name', status: DocumentStatus.PENDING },
                license: { nameKey: 'doc_license_name', status: DocumentStatus.APPROVED },
                vehicleDocs: { nameKey: 'doc_vehicle_docs_name', status: DocumentStatus.REJECTED },
            },
            loadingTeam: { hasTeam: false, teamSize: 0 },
        }
    }
};

let rideRequests = [
    { id: 101, from: 'IKEA, Gurgaon', to: 'Sector 56, Gurgaon', fare: 850, vehicle: 'Pickup', schedule: '10:30 AM', userId: 'user1', userName: 'John Doe', userMobile: '1234567890', chatId: 'user1-driver1' },
    { id: 102, from: 'Nehru Place, Delhi', to: 'Noida Film City', fare: 1200, vehicle: 'Mini Truck', schedule: 'Now', userId: 'user1', userName: 'John Doe', userMobile: '1234567890', chatId: 'user1-driver1' },
];

let chats = {
    'user1-driver1': [
        { id: 'msg1', senderId: 'user1', text: 'Hi, can you reach a bit early?', timestamp: Date.now() - 60000 },
        { id: 'msg2', senderId: 'driver1', text: 'Sure, I am on my way. Will be there in 15 mins.', timestamp: Date.now() - 30000 },
    ]
};

let nextUserId = 2;
let nextDriverId = 3;

export const db = {
    users,
    drivers,
    rideRequests,
    chats,
    findAccountByMobile: (mobile) => {
        return Object.values(users).find(u => u.mobile === mobile) || Object.values(drivers).find(d => d.mobile === mobile);
    },
    findAccountById: (id) => {
        return users[id] || drivers[id];
    },
    updateAccount: (id, updates) => {
        const account = users[id] || drivers[id];
        if (!account) return null;
    
        // Explicitly handle top-level properties to avoid unintended side-effects
        if (updates.name) account.name = updates.name;
        if (updates.password) account.password = updates.password;

        // Handle nested properties based on account type
        if (account.type === 'user') {
            if (updates.addresses) {
                account.addresses = { ...account.addresses, ...updates.addresses };
            }
        } else if (account.type === 'driver') {
            if (updates.profile) {
                // Merge the incoming profile changes into the existing profile
                account.profile = { ...account.profile, ...updates.profile };
            }
        }
        
        return account;
    },
    createUser: (details) => {
        const id = `user${nextUserId++}`;
        const newUser = {
            id,
            type: 'user',
            ...details,
            addresses: { home: details.address, work: ''}
        };
        users[id] = newUser;
        return newUser;
    },
    createDriver: (details) => {
        const id = `driver${nextDriverId++}`;
        const newDriver = {
            id,
            type: 'driver',
            name: details.name,
            mobile: details.mobile,
            password: details.password,
            photoUrl: 'https://i.pravatar.cc/150?u=' + id,
            rating: 0,
            tier: 'bronze',
            reviews: [],
            profile: {
                gender: details.gender,
                country: details.country,
                city: details.city,
                addresses: { home: details.address, work: '' },
                workingHours: 'Mon-Fri, 9 AM - 5 PM', // default
                loadingTeam: { hasTeam: false, teamSize: 0 },
                vehicleProfile: {
                    pictures: ['https://i.imgur.com/sC4sEwN.png'],
                    sizeId: details.vehicleSize,
                    registrationNumber: details.vehicleReg,
                    color: details.vehicleColor,
                    make: details.vehicleMake,
                    model: details.vehicleModel,
                },
                documents: {
                    cnic: { nameKey: 'doc_cnic_name', status: DocumentStatus.PENDING },
                    license: { nameKey: 'doc_license_name', status: DocumentStatus.PENDING },
                    vehicleDocs: { nameKey: 'doc_vehicle_docs_name', status: DocumentStatus.PENDING },
                },
            }
        };
        drivers[id] = newDriver;
        return newDriver;
    },
    getRideRequestsForDriver: (driverId) => {
        // In a real app, this would be a complex query. Here, we just return all.
        return rideRequests;
    },
    removeRideRequest: (requestId) => {
        rideRequests = rideRequests.filter(r => r.id !== requestId);
        return true;
    },
    getChat: (chatId) => {
        if (!chats[chatId]) {
            chats[chatId] = [];
        }
        return chats[chatId];
    },
    addMessageToChat: (chatId, senderId, text) => {
        if (!chats[chatId]) {
            chats[chatId] = [];
        }
        const newMessage = {
            id: `msg${Date.now()}`,
            senderId,
            text,
            timestamp: Date.now()
        };
        chats[chatId].push(newMessage);
        return newMessage;
    }
};