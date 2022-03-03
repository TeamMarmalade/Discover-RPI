export interface Dorm {
    retrieved: Boolean,
    name?: {
        common: String, 
        official: String
    },
    address?: String,
    dining_hall?: Boolean,
    room_types?: String[],
    price?: Number,
    shuttle_stop?: Boolean,
    class?: String[],
    bathroom?: String,
    kitchen?: String,
    floors?: Number,
    ratings?: Number[]
}