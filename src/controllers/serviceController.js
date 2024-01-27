export const main = (req, res) => {
  return res.render("main", { pageTitle: "main" });
};
export const service = (req, res) => {
  return res.render("service", { pageTitle: "service" });
};
