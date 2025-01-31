import { Category } from "@/models/category-model";
import { replaceMongoIdInArray } from './../lib/convertData';

export async function getCategories() {
    const category = await Category.find().lean();
    return replaceMongoIdInArray(category);
}