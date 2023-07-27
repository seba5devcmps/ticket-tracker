const PageTitle = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center gap-y-4 my-5">
    <h1 className="text-4xl font-bold">{title}</h1>
    <h2 className="text-xl">{subtitle}</h2>
  </div>
);

export default PageTitle;
