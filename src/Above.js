import React,{useState} from 'react';
import image from './amazon.jpg';
import styles from './Mystyle.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import img from './usa.png';
import { FaShoppingCart } from 'react-icons/fa';




export default function Above(){
    const [input,setInput]=useState({
        city:"ALL",
        lang:"EN"
    })
    const [count,setCount]=useState(0)
    const handle=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setInput(val=>({...val,[name]:value}));
    }

    return(
        <ul className={styles.ab}>
       <li className={styles.bor}> <img src={image} style={{width:'114px',height:'50px'}} /></li>
        
          <li className={styles.bor}>  <FaMapMarkerAlt size={20} color="white" style={{marginTop:"20px"}}  />
            <div className={styles.loc}>
            <div>Deliver to</div>
            <div><b>India</b></div>
        </div></li>
        <li>

        <form >
            <select value={input.city} onChange={handle} name="city" className={styles.dropdown}>
                <option value="ALL">All  </option>
                <option value="art">Art & Crafts</option>
                <option value="auto">Automotive</option>
                <option value="baby">Baby</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="books">Books</option>
                <option value="boy">Boy's Fashion</option>
                <option value="comp">Computers</option>
                <option value="deal">Deals</option>
                <option value="music">Digital Music</option>
                <option value="electronics">Electronics</option>
                <option value="girl">Girl's Fashion</option>
                <option value="health">Health & Household</option>
                <option value="home">Home & Kitchen</option>
                <option value="scientific">Industrial & Scientific</option>
                <option value="Kindle">Kindle Store</option>
                <option value="lugg">Luggage</option>
                <option value="men">Men's Fashion</option>
                <option value="movies">Movies</option>
                <option value="cd">Music,CDs & Vinyl</option>
                <option value="pet">Pet Supplies</option>
                <option value="prime">Prime Video</option>
                <option value="software">Software</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="tools">Tools & Home Improvement</option>
                <option value="toy">Toys & Games</option>
                <option value="video">Video Games</option>
                <option value="women">Women's Fashion</option>
                

            </select>
          
            <input type="text" placeholder="Search Amazon" name="search" value={input.search||""}  className={styles.search} />
            <button type="submit" className={styles.sbut}><FaSearch color="black" size={18} /></button>

        </form>
        </li>
        <li className={styles.bor}><div className={styles.flag}><img src={img} className={styles.flagIcon} /> <div><b>EN</b></div></div>
</li>
        <li className={styles.bor}><div><div>Hello,sign in</div><div><b>Accounts&Lists</b></div></div></li>
        <li className={styles.bor}><div><div>Returns</div><div><b>& Orders</b></div></div></li>
        <li className={styles.bor}><div className={styles.cartText}><div className={styles.cart}><div><b>{count}</b></div><div><FaShoppingCart size={24} color="white" />
</div></div><div><b>Cart</b></div></div></li>
        </ul>
    )

}