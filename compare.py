import json
import sys

def main():
	open('static/final.txt', 'w').close()
	file = open('static/final.txt', 'a+')

	fbFriends = []
	friends = []
	followers = []
	common = []
	commonUgly = []
	numberCommon = 0

	data = openFile('static/fbFriends.json')
	for criteria in data['data']:
		for key, value in criteria.items():
			if key == "name":
				# print(key, 'is:', value)
				fbFriends.append(value)
		# print('')
	# print(fbFriends)

	data = openFile('static/friends.json')
	for users in data['users']:
		for criteria in users:
			for key, value in criteria.items():
				if key == "screen_name":
					# print(key, 'is:', value)
					friends.append(value)
			# print('')
	# print(friends)

	data = openFile('static/followers.json')
	for users in data['users']:
		for criteria in users:
			for key, value in criteria.items():
				if key == "screen_name":
					# print(key, 'is:', value)
					followers.append(value)
			# print('')
	# print(followers)

	for amigo in fbFriends:
		tempAmigo = ''.join(e for e in amigo if e.isalnum())
		tempAmigo = tempAmigo.lower()
		for van in friends:
			tempVan = ''.join(e for e in van if e.isalnum())
			tempVan = tempVan.lower()
			if tempAmigo == tempVan:
				# print('Found one: ' + amigo)
				common.append(amigo)
				commonUgly.append(tempAmigo)
				numberCommon = numberCommon + 1

	for amigo in fbFriends:
		tempAmigo = ''.join(e for e in amigo if e.isalnum())
		tempAmigo = tempAmigo.lower()
		for van in followers:
			tempVan = ''.join(e for e in van if e.isalnum())
			tempVan = tempVan.lower()
			if tempAmigo == tempVan:
				if tempAmigo not in commonUgly:
					# print('Found one: ' + amigo)
					common.append(amigo)
					numberCommon = numberCommon + 1
				# else:
				# 	print('Found duplicate: ' + amigo)

	if numberCommon > 0:
		print("Friends in common: " + str(common))
		file.write(str(common) + "\n")
		print("; Number of friends in common: " + str(numberCommon))
		file.write(str(numberCommon) + "\n")
	else:
		print("No friends in common found...")
	file.write(str(common) + "\n")
	file.write(str(numberCommon) + "\n")

	fbLocation = ""
	hometown = ""
	location = ""
	data = openFile('static/userData.json')
	try:
		fbLocation = data["location"]["name"]
		fbLocation = fbLocation.split(',', 1)[0]
	except KeyError:
		pass
	try:
		hometown = data["hometown"]["name"]
		hometown = hometown.split(',', 1)[0]
	except KeyError:
		pass

	data = openFile('static/user.json')
	try:
		location = data["location"]
		location = location.split(',', 1)[0]
	except KeyError:
		pass

	if location == fbLocation or location == hometown:
		print("; Common location found: " + location)
	else:
		print("No common location found...")
	file.write(location + "\n")

def openFile(f):
	try:
		data = json.load(open(f))
		return data
	except FileNotFoundError:
		print(f + " not found")
		sys.exit()

if __name__ == "__main__":main()