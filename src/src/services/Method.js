import axios from "axios";

// Function to fetch access token from sessionStorage
const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

const getLag = () => {
  return sessionStorage.getItem("lag");
};

export async function get_api(your_api) {
  try {
    const token = getAccessToken();
    const lag = getLag();
    const response = await axios.get(your_api, {
      params: { Lag: lag },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    //console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error", error.message);
  }
}

export async function delete_api(your_api, formData) {
  try {
    const token = getAccessToken();
    const response = await axios.delete(your_api, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return error.response.data;
  }
}

export async function post_api(your_api, formData) {
  try {
    const token = getAccessToken();
    const response = await axios.post(your_api, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  
  } catch (error) {
    console.log("Error", error);
    return error.response.data;
  }
}

export async function login_api(your_api, formData) {
  try {
    const response = await axios.post(your_api, formData);
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error", error.message);
  }
}

export async function put_api(your_api, formData) {
  try {
    const response = await axios.put(your_api, formData);
    return response.data.success;
  } catch (error) {
    console.log("Error", error.message);
  }
}

//==========================================================
export async function get_api_with_params(your_api, data) {
  try {
    const token = getAccessToken();
    const lag = getLag();
    const response = await axios.get(your_api, {
      params: {
        ...data,
        Lag: lag,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    //console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error", error.message);
    return error.response ? error.response.data : null;
  }
}
