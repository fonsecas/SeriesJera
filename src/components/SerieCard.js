import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';
import Constants from '../util/Constants';
import { Card, Icon, CardItem, Left, Right } from 'native-base';
import SwipeableRating from 'react-native-swipeable-rating';



const SerieCard = ({ serie, onPress, isWatched }) => (
	<TouchableOpacity style={{ width: 140 }}
		onPress={onPress}
		activeOpacity={1} >
		<Card style={{ backgroundColor: "#455A64", borderColor: '#455A64' }}>
			<CardItem cardBody style={{ borderWidth: 0 }}>
				<Image source={{
					uri: serie.poster_path != null
						? Constants.URL.IMAGE_URL + serie.poster_path
						: Constants.URL.PLACEHOLDER_IMAGE
				}} style={{ height: 210, width: null, flex: 1 }} />
			</CardItem>
			<View style={{ marginLeft: 5, marginTop: 5, height: 60, flex: 1, flexDirection: 'column' }}>
				<Text style={{
					color: 'white',
					fontSize: 15,
					fontFamily: 'Roboto',
				}}>{serie.title}</Text>
				{serie.genre_ids ? <Text style={{ color: 'white', fontSize: 11 }}>

					{Constants.Strings.GENRES.map((item => {
						if (item.id === serie.genre_ids[0]) {
							return item.name
						}

					})) 
					}
				</Text>
					: <Text style={{ color: 'white', fontSize: 11, paddingHorizontal: 4 }}>
						{`${serie.genres[0].name} - ${serie.release_date.split("-", 1)}`}
					</Text>}
			</View>

			<CardItem cardBody style={{ marginLeft: 5, marginBottom: 5, marginRight: 5, backgroundColor: '#455A64' }}>
				<Left>
					<SwipeableRating
						rating={serie.vote_average / 2}
						size={15}
						gap={0}
						color={'#F5FCFF'}
						emptyColor={'#F5FCFF'}
						swipeable={false}
					/>
				</Left>
				<Right>
					{isWatched ? <Text style={{ fontSize: 10, color: '#9ace6a' }}>Assistido</Text> : null}
				</Right>
			</CardItem>


		</Card>
	</TouchableOpacity>
);

export default SerieCard;