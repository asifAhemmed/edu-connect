import { Category } from "@/models/category-model";
import { Course } from "@/models/course-model";
import { Module } from "@/models/module-model";
import { Testimonial } from "@/models/testimonial-model";
import { User } from "@/models/user-model";
import { replaceMongoIdInArray } from './../lib/convertData';

export async function getCourses() {
    const course = await Course.find().select(["thumbnail","title","category","instructor","testimonials","modules","price","description"]).populate({
        path: "category",
        model: Category
    }).populate({
        path: "instructor",
        model: User
    }).populate({
        path: "testimonials",
        model: Testimonial
    }).populate({
        path:"modules",
        model: Module
    }).lean();
    return replaceMongoIdInArray(course)
}