import { Testimonial } from "@/models/testimonial-model";

import { replaceMongoIdInArray } from "@/lib/convertData";

export async function getTestimonialsForCourse(courseId) {
    console.log(courseId)
    const testimonials = await Testimonial.find({ courseId: courseId }).lean();
    return replaceMongoIdInArray(testimonials);
}