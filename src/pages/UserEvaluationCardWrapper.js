import { useParams } from 'react-router-dom';
import UserEvaluationCard from './UserEvaluationCard';

const UserEvaluationCardWrapper = () => {
  const { userId } = useParams();
  return <UserEvaluationCard userId={userId} />;
};

export default UserEvaluationCardWrapper;
