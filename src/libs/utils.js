const TOKEN_KEY = "token"
const USER_INFO = "user_info"

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token ? token : ''
}

export const setUserInfo = (userInfo) => {
	localStorage.setItem(USER_INFO, userInfo)
}

export const getUserInfo = () => {
	return localStorage.getItem(USER_INFO)
}

export const matchPathName = (names, routes) => {
    if (names.length == 0) {
		return [];
	} else {
		let arr = []
		let rarr = []
		let temp = names.shift()
		routes.forEach(item => {
			if (item.name == temp) {
				arr.push(item.meta.title)
				rarr = item.children
			} else if (item.redirect == temp) {
				arr = matchPathName([temp], item.children)
				rarr = item.children[0].children
			}
		})
		return arr.concat(matchPathName(names, rarr))
	}
}

export const generateMenuTreeData = (data, parentId) => {
	var res = []
	data.forEach(item => {
		if (item.parentId == parentId) {
			var node = Object.assign({}, item)
			node.title = item.menuName
			node.children = generateMenuTreeData(data, item.menuId)
			res.push(node)
		}
	})
	return res.sort((a, b) => {
		if (a.order > b.order) {
			return 1
		} else {
			return -1
		}
	})
}

export const generateUserTreeData = (allData, userInfo) => {
	var res = {
		title: '用户',
		expand: true,
		isUser: false,
		children: []
	}
	allData.forEach(item => {
		res.children.push({
			title: item.nickName,
			user_id: item.userId,
			count: item.count,
			isUser: true,
			checked: userInfo.indexOf(item.count) > -1 ? true : false
		})
	})

	return [res]
}

export const uuid = () => {
	var temp_url = URL.createObjectURL(new Blob());
	var uuid = temp_url.toString(); // blob
	URL.revokeObjectURL(temp_url);
	return uuid.substring(uuid.lastIndexOf("/") + 1);
}