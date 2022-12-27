def return_marker_data(marker):
    images = []
    for image in marker.images:
        images.append(image.url)
    return {
        "id": marker.id,
        "position": marker.position,
        "text": marker.text,
        "images": images,
    }


def return_user_data(user):
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
        "hideOtherUsers": user.hide_other_users,
        "locale": user.locale,
        "markers": marker_ls
    }
    return result
