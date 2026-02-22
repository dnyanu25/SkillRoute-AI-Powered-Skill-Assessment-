import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Testimonials() {

    const ref = useRef([]);
    const data = [
    {
        review: 'This platform helped me understand exactly where I stand in my skills. The roadmap clearly shows what to learn next and how to improve step by step.',
        name: 'Arjun Mehta',
        about: 'Computer Science Student',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    },
    {
        review: 'The skill assessments are well-structured and practical. I really like how it identifies weak areas and suggests focused learning paths.',
        name: 'Nayan Sharma',
        about: 'Information Technology Student',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    },
    {
        review: 'The roadmap feature makes learning new technologies less overwhelming. It breaks complex topics into manageable steps with clear milestones.',
        name: 'Rohan Verma',
        about: 'Frontend Developer Intern',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'I appreciate how the platform combines theory with testing. The assessments ensure I actually understand the concepts instead of just watching tutorials.',
        name: 'Piyush Nair',
        about: 'Software Engineering Student',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'The personalized recommendations based on my test results are very helpful. It feels like a smart learning assistant guiding my progress.',
        name: 'Kajol Patel',
        about: 'Full Stack Learner',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
        review: 'This project makes self-assessment simple and effective. The structured roadmap and performance tracking motivate me to improve continuously.',
        name: 'Abhinav Gupta',
        about: 'B.Tech Student',
        rating: 5,
        image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png',
    },
];
    return (
        <section className="mt-32 flex flex-col items-center">
            <SectionTitle
                title="Here what aur trusted users about our best AI agents."
                description="Empower your business with AI agents that optimize processes and accelerate performance."
            />
            <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {data.map((item, index) => (
                    <motion.div key={index} className='w-full max-w-88 space-y-5 rounded-lg glass p-5 hover:-translate-y-1'
                        initial={{ y: 150, opacity: 0 }}
                        ref={(el) => (ref.current[index] = el)}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        onAnimationComplete={() => {
                            const card = ref.current[index];
                            if (card) {
                                card.classList.add("transition", "duration-300");
                            }
                        }}
                    >
                        <div className='flex items-center justify-between'>
                            <p className="font-medium">{item.about}</p>
                            <img className='size-10 rounded-full' src={item.image} alt={item.name} />
                        </div>
                        <p className='line-clamp-3'>“{item.review}”</p>
                        <p className='text-gray-300'>
                            - {item.name}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}