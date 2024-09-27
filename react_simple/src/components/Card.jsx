import {Link} from "react-router-dom"

const Card = ({ post }) => {
    if (!post) {
      // Vous pouvez retourner null ou une mise en page alternative
      return <div>Post not found</div>;
    }
  
    return (
      <div className="card"> 
        <Link className="link" to={`/post/${post.id}`}> 
        <span className="title">{post.title}</span>
        <img src={post.img} alt="" className="img" />
        <p className="desc">{post.desc}</p>
        <button className="cardButton">Read More</button>
        </Link>
      </div>
    );
  };
  
  export default Card;
  