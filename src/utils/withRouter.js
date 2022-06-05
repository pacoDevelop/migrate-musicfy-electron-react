import { useLocation, useNavigate, useParams } from "react-router-dom";
 
export const withRouter = (Component) => {
  const Wrapper = (props) => {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
 
    return (
      <Component
        location={location}
        navigate={navigate}
        params={params}
        {...props}
      />
    );
  };
 
  return Wrapper;
};