"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
const contactSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
	email: z.string().email("Enter a valid email address"),
	subject: z.string().min(4, "Subject must be at least 4 characters").max(100, "Subject is too long"),
	message: z
		.string()
		.min(20, "Message must be at least 20 characters")
		.max(1000, "Message must be under 1000 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactClient = () => {
	const form = useForm<ContactFormValues>({
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
		validators: {
			onSubmit: contactSchema,
		},
		onSubmit: ({ value }) => {
			console.log("Contact form submitted:", value);
			form.reset();
		},
	});

	return (
		<div className="bg-white min-h-screen">
			<section className="bg-[#FEF2F2] py-16">
				<div className="max-w-7xl mx-auto px-10 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12px] font-semibold text-[#2B2B30] shadow-sm mb-5">
						<span className="w-1.5 h-1.5 rounded-full bg-[#EF4C5C]" />
						We&apos;d love to hear from you
					</div>
					<h1 className="text-[48px] font-extrabold tracking-[-0.035em] text-[#0F0F10] leading-tight mb-4">
						Get in <span className="text-[#EF4C5C]">Touch</span>
					</h1>
					<p className="text-[16px] text-[#6B6B73] max-w-md mx-auto">
						Have a question, feedback, or a partnership idea? Drop us a message and we&apos;ll get back to you within 24
						hours.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="max-w-7xl mx-auto px-10">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
						<div className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[18px] p-8">
							<h2 className="text-[22px] font-bold text-[#0F0F10] tracking-tight mb-1">Send us a message</h2>
							<p className="text-[14px] text-[#6B6B73] mb-8">
								Fill out the form below and we&apos;ll respond as soon as possible.
							</p>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit();
								}}
								className="flex flex-col gap-5"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
									<form.Field name="name" validators={{ onChange: contactSchema.shape.name }}>
										{(field) => (
											<div className="flex flex-col gap-1.5">
												<Label htmlFor="name" className="text-[13px] font-semibold text-[#0F0F10]">
													Full Name
												</Label>
												<Input
													id="name"
													placeholder="John Doe"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													className="bg-white border-[#EAEAEE] rounded-[10px] text-[14px] h-11 focus-visible:ring-[#EF4C5C]/30 focus-visible:border-[#EF4C5C]"
												/>
												{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
													<p className="text-[12px] text-[#EF4C5C]">{field.state.meta.errors[0]?.message}</p>
												)}
											</div>
										)}
									</form.Field>

									<form.Field name="email" validators={{ onChange: contactSchema.shape.email }}>
										{(field) => (
											<div className="flex flex-col gap-1.5">
												<Label htmlFor="email" className="text-[13px] font-semibold text-[#0F0F10]">
													Email Address
												</Label>
												<Input
													id="email"
													type="email"
													placeholder="john@example.com"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													className="bg-white border-[#EAEAEE] rounded-[10px] text-[14px] h-11 focus-visible:ring-[#EF4C5C]/30 focus-visible:border-[#EF4C5C]"
												/>
												{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
													<p className="text-[12px] text-[#EF4C5C]">{field.state.meta.errors[0]?.message}</p>
												)}
											</div>
										)}
									</form.Field>
								</div>

								<form.Field name="subject" validators={{ onChange: contactSchema.shape.subject }}>
									{(field) => (
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="subject" className="text-[13px] font-semibold text-[#0F0F10]">
												Subject
											</Label>
											<Input
												id="subject"
												placeholder="What is this about?"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className="bg-white border-[#EAEAEE] rounded-[10px] text-[14px] h-11 focus-visible:ring-[#EF4C5C]/30 focus-visible:border-[#EF4C5C]"
											/>
											{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
												<p className="text-[12px] text-[#EF4C5C]">{field.state.meta.errors[0]?.message}</p>
											)}
										</div>
									)}
								</form.Field>

								<form.Field name="message" validators={{ onChange: contactSchema.shape.message }}>
									{(field) => (
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="message" className="text-[13px] font-semibold text-[#0F0F10]">
												Message
											</Label>
											<Textarea
												id="message"
												placeholder="Write your message here..."
												rows={5}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className="bg-white border-[#EAEAEE] rounded-[10px] text-[14px] resize-none focus-visible:ring-[#EF4C5C]/30 focus-visible:border-[#EF4C5C]"
											/>
											<div className="flex justify-between items-center">
												{field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
													<p className="text-[12px] text-[#EF4C5C]">{field.state.meta.errors[0]?.message}</p>
												) : (
													<span />
												)}
												<span className="text-[11px] text-[#9CA0A8] ml-auto">{field.state.value.length} / 1000</span>
											</div>
										</div>
									)}
								</form.Field>

								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<Button
											type="submit"
											disabled={isSubmitting}
											className="bg-[#EF4C5C] hover:bg-[#DC3545] text-white rounded-[10px] h-11 font-semibold text-[14px] mt-1"
										>
											<Send className="w-4 h-4 mr-2" />
											{isSubmitting ? "Sending..." : "Send Message"}
										</Button>
									)}
								</form.Subscribe>
							</form>
						</div>

						<div className="flex flex-col gap-4">
							{[
								{
									icon: Mail,
									label: "Email Us",
									value: "support@cinetube.com",
									sub: "We reply within 24 hours",
									bg: "bg-[#FEF2F2]",
									iconColor: "text-[#EF4C5C]",
									iconBg: "bg-[#FDE7EA]",
								},
								{
									icon: Phone,
									label: "Call Us",
									value: "+1 (800) 246-8357",
									sub: "Mon – Fri, 9am – 6pm EST",
									bg: "bg-[#FDF1D5]",
									iconColor: "text-[#D97706]",
									iconBg: "bg-[#FEF3C7]",
								},
								{
									icon: MapPin,
									label: "Office",
									value: "San Francisco, CA",
									sub: "United States",
									bg: "bg-[#DDF4E5]",
									iconColor: "text-[#16A34A]",
									iconBg: "bg-[#DCFCE7]",
								},
							].map((item) => {
								const Icon = item.icon;
								return (
									<div key={item.label} className={`${item.bg} rounded-[14px] p-6 flex items-start gap-4`}>
										<div
											className={`w-11 h-11 rounded-[10px] ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}
										>
											<Icon className="w-5 h-5" />
										</div>
										<div>
											<p className="text-[12px] font-semibold text-[#6B6B73] uppercase tracking-wide mb-0.5">
												{item.label}
											</p>
											<p className="text-[15px] font-bold text-[#0F0F10]">{item.value}</p>
											<p className="text-[13px] text-[#6B6B73]">{item.sub}</p>
										</div>
									</div>
								);
							})}

							<div className="bg-[#FAFAFA] border border-[#F2F2F5] rounded-[14px] p-6 mt-2">
								<p className="text-[13px] text-[#6B6B73] leading-relaxed">
									For urgent issues related to your subscription or account access, please include your registered email
									in the message so we can locate your account faster.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ContactClient;
