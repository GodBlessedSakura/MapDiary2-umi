def return_marker_data(marker):
    images = []
    for image in marker.images:
        images.append(image.url)
    return {
        "id": marker.id,
        "position": marker.position,
        "text": marker.text,
        "title": marker.title,
        "images": images,
    }


def return_user_data(user, access_token):
    marker_ls = []
    for marker in user.markers:
        marker_ls.append(return_marker_data(marker))

    result = {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "avatar": user.avatar,
        "isAdmin": user.is_admin,
        "displayUser": user.display_user,
        "displayOtherUsers": user.display_other_users,
        "locale": user.locale,
        "markers": marker_ls
    }
    if access_token:
        result['access_token'] = access_token
    return result
