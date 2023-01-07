def return_marker_data_without_images(marker):

    return {
        "id": marker.id,
        "position": marker.position,
        "text": marker.text,
        "title": marker.title,
        "owner": True
    }


def return_images(marker, access_token):
    images = []
    for image in marker.images:
        images.append(image.url)
    result = {"images": images}
    if access_token:
        result['access_token'] = access_token
    return result


def return_other_markers_without_img(markers, access_token):
    marker_objects = []
    for marker in markers:

        marker_objects.append({
            "id": marker.id,
            "position": marker.position,
            "text": marker.text,
            "title": marker.title,
        })
    result = {"markers": marker_objects}
    if access_token:
        result['access_token'] = access_token
    return result


def return_user_data(user, access_token):
    marker_ls = []
    for marker in user.markers:
        if marker.enable:
            marker_ls.append(return_marker_data_without_images(marker))

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


def return_all_user_info(users, access_token):
    user_list = []
    for user in users:
        marker_ls = []
        for marker in user.markers:
            if marker.enable:
                marker_ls.append(return_marker_data_without_images(marker))

        user_info = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "avatar": user.avatar,
            "isAdmin": user.is_admin,
            "enable": user.enable,
            "displayUser": user.display_user,
            "displayOtherUsers": user.display_other_users,
            "locale": user.locale,
            "markers": marker_ls
        }
        user_list.append(user_info)
    result = {'users': user_list}
    if access_token:
        result['access_token'] = access_token
    return result
