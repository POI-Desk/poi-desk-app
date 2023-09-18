import { writable } from "svelte/store"

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
    data: T[],
    filtered: T[],
    search: string
}

export const createSearchStore = <T extends Record<PropertyKey, any>>(data: T[]) => {

    const { subscribe, set, update } = writable<SearchStoreModel<T>>({
        data, 
        filtered: data,
        search: '',
    })

    return {
        subscribe, 
        set, 
        update
    }
    
}

export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>) => {
    const searchTerm = store.search.toLowerCase() || "";
    store.filtered = store.data.filter((user) => {
        return user.username.toLowerCase().includes(searchTerm)
    })
}