export default {
  routes: [
    {
      method: "POST",
      path: "/image-analysis",
      handler: "image-analysis.analyze",
      config: {
        auth: {
          scope: ["api::image-analysis.image-analysis.analyze"],
        },
      },
    },
  ],
};
