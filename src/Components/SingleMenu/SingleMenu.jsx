
import { Box, Button, Heading, HStack, Icon, Image, Text, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { setFinalCartItems, setFinalCartPrice } from '../../Redux/Cart/action';

const SingleMenu = ({e,id}) => {

    const [cartData, setCartData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [GST, setGST] = useState(0);
    const [RH, setRH] = useState('37.00');
    const [donation, setDonation] = useState('00');
    const [final, setFinal] = useState(0);

    const dispatch = useDispatch();
 
    const [qty, setQty] = useState(1);
    const toast = useToast();
    const [btnsDisplay, setBtnsDisplay] = useState("none");
    const [addToCartDisplay, setAddToCartDisplay] = useState("block");

    const addToCart = async (e) => {
        setAddToCartDisplay("none")
        setBtnsDisplay("flex")
        e.qty = 1 
        try {
            let res = await fetch('https://creepy-fawn-purse.cyclic.app/api/cart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(e)
            })
            let response = await res.json()
            console.log(response.message)
            fetchCartData ()
            if (response) {
                toast({
                    title: `Added to cart successfully`,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.log(error.message)
            toast({
                title: `${error.message} toast`,
                status: 'warning',
                isClosable: true,
                duration: 1000,
            })
        }
    }

    // const fetchCartData = () => {
    //     fetch("https://creepy-fawn-purse.cyclic.app/api/cart").then((res) => {
    //       return res.json()
    //     }).then((res) => {
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   }
    const fetchCartData = () => {
        fetch("https://creepy-fawn-purse.cyclic.app/api/cart").then((res) => {
          return res.json()
        }).then((res) => {
          setCartData(res)
          setTotalItems(res.length)
          Calculations(res)
          dispatch(setFinalCartItems(res.length))
          setCartData(res)
        }).catch((err) => {
          console.log(err)
        })
      }
    
      const Calculations = (cartDat) => {
        console.log("see",cartDat,cartData)
        let price = 0;
        for (let i = 0; i < cartDat.length; i++) {
          price += ((+cartDat[i].price) * (cartDat[i].qty))
        }
        let Gst = price * 0.18;
        let finalPrice = price + Gst + (+RH) + (+donation) - discount
        setSubtotal(price.toFixed(2))
        setGST(Gst.toFixed(2))
        setFinal(finalPrice.toFixed(2))
        console.log(finalPrice)
        dispatch(setFinalCartPrice(finalPrice.toFixed(0)));
      }

    const decreaseQty = async(e) => {
        if (e.qty <= 1) {
            setQty(1)
        } else {
            setQty((prev) => prev - 1)
        }
        let id = e._id;
        e.qty = e.qty-qty
        try {
            let res = await fetch(`https://creepy-fawn-purse.cyclic.app/api/cart/:${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(e)
            })
            let response = await res.json()
            console.log(response.message)
            setQty(1)
            fetchCartData()
        } catch (error) {
            console.log(error)
        }
    }

    const increaseQty = async (e) => {
        setQty((prev) => prev + 1)
        e.qty = e.qty+qty
        try {
            let res = await fetch(`https://creepy-fawn-purse.cyclic.app/api/cart/:${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(e)
            })
            let response = await res.json()
            console.log(response.message)
            setQty(1)
            fetchCartData()
        } catch (error) {
            console.log(error)
        }
    }
 
 
    return (
        <Box
            bg="white"
            key={id}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
            textAlign='start'
            margin="5%"
            borderRadius="5px">
            <Image
                src={e.image}
                borderRadius="5px 5px 0px 0px">
            </Image>
            <VStack
                pb="5%"
                w="100%"
                pl="5%"
                pr="3%"
                align="space-around">
                <Heading
                    w="100%"
                    mt="3%"
                    size="sm"
                    fontWeight="semibold">
                    {e.title}
                </Heading>
                <HStack
                    w="100%"
                    fontSize={12}
                    color="gray.600"
                    fontWeight="semibold">
                    <Image
                        src={e.type == "Non veg" ?
                            "https://online.kfc.co.in/static/media/Non_veg_dot_Icon.d975d1f9.svg" :
                            "https://online.kfc.co.in/static/media/Veg_dot_Icon.d1a3902d.svg"}>
                    </Image>
                    <Text
                        pr="5%">
                        {e.type}
                    </Text>
                    <ul>
                        <li>
                            <Text pl="-2%">{e.serve ? e.serve : "Serves 2-3"}</Text>
                        </li>
                    </ul>
                </HStack >
                <HStack
                    fontSize={15}
                    w="100%"
                    fontWeight="semibold">
                    <Text
                        as="del"
                        color="red">
                        ₹{(+(e.price) + (+(e.price) * 0.15)).toFixed(2)}
                    </Text>
                    <Text
                        pl="5%"
                        color="green">
                        ₹{e.price}
                    </Text>
                </HStack>
                <Text
                    w="100%"
                    pb="3%"
                    fontSize={14}
                    color="gray.500"
                    fontWeight="500">
                    {e.desc}
                </Text>
                <Button
                    onClick={() => addToCart(e)}
                    display={addToCartDisplay}
                    w={["100px", "111px", "122px", "120px"]}
                    _hover={{ backgroundColor: "red" }}
                    borderRadius="17px"
                    fontSize="13px"
                    color="white"
                    h="33px"
                    bg="red">
                    Add to Cart
                </Button>
                <HStack
                    display={btnsDisplay}
                    w={["100px", "111px", "122px", "120px"]}
                    h="33px" >
                    <Button isDisabled={(e.qty <= 1)} borderRadius="44%" bg="ransparent" _hover={{ backgroundColor: "transparent",cursor: "pointer" }}>
                        <Icon _hover={{ cursor: "pointer" }} as={AiFillMinusCircle} boxSize={[5, 6, 7, 8]} onClick={() => decreaseQty(e)}></Icon>
                    </Button>
                    <Text >{e.qty}</Text>
                    <Button borderRadius="44%" bg="transparent" _hover={{ backgroundColor: "transparent",cursor: "pointer" }}>
                        <Icon _hover={{ cursor: "pointer" }} as={AiFillPlusCircle} boxSize={[5, 6, 7, 8]} onClick={() => increaseQty(e)}></Icon>
                    </Button>
                </HStack>
            </VStack >
        </Box>
    )
}

export  {SingleMenu}