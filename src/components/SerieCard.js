import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import Constants from '../util/Constants';
import { Rating, } from 'react-native-elements';
import { Card, Icon, CardItem, Left, Right } from 'native-base';


const SerieCard = ({ serie, onPress, isWatched }) => (
	<TouchableOpacity style={{ width: 140 }}
		onPress={onPress}
		activeOpacity={1} >
		<Card >
			<CardItem cardBody style={{ borderWidth: 0, backgroundColor: '#f9f9f9' }}>
				<Image source={{
					uri: serie.poster_path != null
						? Constants.URL.IMAGE_URL + serie.poster_path
						: Constants.URL.PLACEHOLDER_IMAGE
				}} style={{ height: 210, width: null, flex: 1 }} />
			</CardItem>
			<View style={{ marginLeft: 5, marginTop: 5, height: 60, flex: 1, flexDirection: 'column' }}>
				<Text style={{
					color: '#737373',
					fontSize: 15,
					fontFamily: 'Roboto',
				}}>{serie.title}</Text>
				{serie.genre_ids ? <Text style={{ color: '#737373', fontSize: 11 }}>

					{Constants.Strings.GENRES.map((item => {
						if (item.id === serie.genre_ids[0]) {
							return item.name
							// `${item.name} - ${serie.release_date.split("-", 1)}`
						}

					}))
					}
				</Text>
					: <Text style={{ color: '#737373', fontSize: 11, paddingHorizontal: 4 }}>
						{`${serie.genres[0].name} - ${serie.release_date.split("-", 1)}`}
					</Text>}
			</View>

			<CardItem cardBody style={{ marginLeft: 5, marginBottom: 5, marginRight: 5 }}>
				<Left>
					<Rating imageSize={15} readonly startingValue={(serie.vote_average / 10) * 5} />
				</Left>
				<Right>
					{isWatched ? <Text style={{ fontSize: 10, color: '#9ace6a' }}>Assistido</Text> : null}
				</Right>
			</CardItem>


		</Card>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: {
		// Solução 2
		// flex: .5,  

		// Solução 1
		width: '50%',
		paddingHorizontal: 5,
		paddingVertical: 5,
		// height: Dimensions.get('window').width / 2,
		height: 380,
		// borderWidth: 1,
		// borderColor: 'blue',



	},
	card: {
		flex: 1,
		//borderWidth: 1,
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		elevation: 2,
		padding: 2

		// Solução 2
		// margin: 10
	},
	cardTitleWrapper: {
		backgroundColor: 'black',
		height: 50,

		position: 'absolute',
		bottom: 0,
		opacity: .8,

		width: '100%',

		paddingTop: 10,
		paddingBottom: 10,

		paddingLeft: 3,
		paddingRight: 3,

		alignItems: 'center'
	},
	cardTitle: {
		color: '#333',
		fontSize: 16,
		fontFamily: 'Roboto',
		paddingHorizontal: 4
	},
	firstColumn: {
		paddingLeft: 10
	},
	lastColumn: {
		paddingRight: 10
	}
});

export default SerieCard;