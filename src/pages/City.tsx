import Dashboard from "@/layout/Dashboard";
import { useParams } from "react-router";

const City = () => {
  let params = useParams();
  console.log(params);
  return <Dashboard>{params.cityName} City</Dashboard>;
};

export default City;
