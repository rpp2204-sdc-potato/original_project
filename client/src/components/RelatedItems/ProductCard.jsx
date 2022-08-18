import React from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';

// Individual card in related product carousel
function ProductCard({ product, handleModalButtonClick }) {
  return (
    <div className="duke-card-container">
      <div
        className="duke-card-header"
        style={{ backgroundImage: `url(${product.url})` }}
      >
        <IconContext.Provider value={{ className: "duke-action-icon" }}>
          <AiOutlineStar onClick={handleModalButtonClick} />
        </IconContext.Provider>
      </div>
      <div className="duke-productcard-body">
        <p>{product.category}</p>
        <p>{product.description}</p>
        <p>{product.default_price}</p>
        <div>
          <img className="duke-card-stars" src="https://cdn.searchenginejournal.com/wp-content/uploads/2021/08/a-guide-to-star-ratings-on-google-and-how-they-work-6123be39b9f2d-sej-760x400.jpg" alt="stars" />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
