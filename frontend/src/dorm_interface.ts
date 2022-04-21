export interface Dorm {
    retrieved: boolean,
    name: {
        common: string, 
        official: string
    },
    address: string,
    dining_hall: string,
    room_types: string[],
    price: number,
    shuttle_stop: boolean,
    class: string[],
    bathroom: string,
    kitchen: string,
    floors: number,
    ratings: number[],
    image: string[],
    reviews: {
        user: string,
        msg: string,
        stars: number,
        upvotes: string[]
    }[]
}