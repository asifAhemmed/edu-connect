import { Category } from "@/models/category-model";
import { Course } from "@/models/course-model";
import { Module } from "@/models/module-model";
import { Testimonial } from "@/models/testimonial-model";
import { User } from "@/models/user-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from './../lib/convertData';
import { getTestimonialsForCourse } from "./testimonials";
import { getEnrollmentsForCourse } from "./enrollments";

export async function getCourses() {
    const course = await Course.find().select(["thumbnail","title","category","instructor","testimonials","modules","price","description"]).populate({
        path: "category",
        model: Category
    }).populate({
        path: "instructor",
        model: User
    }).populate({
        path: "testimonials",
        model: Testimonial,
        populate: {
            path: "user",
            model: User
        }
    }).populate({
        path:"modules",
        model: Module
    }).lean();
    return replaceMongoIdInArray(course)
}

export async function getCourseDetails(id) {
    const course = await Course.findById(id)
    .populate({
        path: "category",
        model: Category
    }).populate({
        path: "instructor",
        model: User
    }).populate({
        path: "testimonials",
        model: Testimonial,
        populate: {
            path: "user",
            model: User
        }
    }).populate({
        path: "modules",
        model: Module
    }).lean();

    return replaceMongoIdInObject(course)
}

export async function getCourseDetailsByInstructor(instructorId) {
    const courses = await Course.find({instructor: instructorId}).lean();

    const enrollments = await Promise.all(
        courses.map(async (course) => {
          const enrollment = await getEnrollmentsForCourse(course._id.toString());
          return enrollment;
        })
    );

    const totalEnrollments = enrollments.reduce((item, currentValue) => {
        return item.length + currentValue.length;
    });

    const testimonials = await Promise.all(
        courses.map(async (course) => {
          const testimonial = await getTestimonialsForCourse(course._id.toString());
          return testimonial;
        })
      );

      const totalTestimonials = testimonials.flat();
      const avgRating = (totalTestimonials.reduce(function (acc, obj) {
            return acc + obj.rating;
        }, 0)) / totalTestimonials.length;

    // console.log("testimonials", totalTestimonials, avgRating);

    return {
        "courses": courses.length,
        "enrollments": totalEnrollments,
        "reviews": totalTestimonials.length,
        "ratings": avgRating.toPrecision(2)
    }
}
