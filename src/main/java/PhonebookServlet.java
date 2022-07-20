
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class AccountServiceServlet
 */
@WebServlet("/phonebookServlet")
public class PhonebookServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String baseUrl = "https://s0w1.duckdns.org:9445/phonebook/contact/";
	private String authHeader = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiYXVkIjoiekNFRSIsInN1YiI6InlwZ2VAYXUxLmlibS5jb20iLCJyZWFsbSI6IkFEQ0RQTCIsImlzcyI6ImxpYmVydHkiLCJleHAiOjE2ODE0Nzk0NjksImlhdCI6MTU4MTQ3MjI2OX0.KJlE-wS1N48cWz1F1uDxpSN7uR9fb4uFGxY3o31OxuoQRFjYTXiaadeDzhmBrz0LK30bdi2oGZlfs0DEhFIkC8iwJlKRS4-bMudTLK37E_UW6T6EhjFmO-X8DUNJeiKVEz0rc982QFoGQLCm7T7-YT7HNqId2RFPe1JKWebJfH-zepME-R6CNpsu7f3ZWnJsopCz2ewuOtt72xtozf6ZnAXTUM46bp60vUbh7btha8C9XNHxq2pIKOJ6sJfcWjqjhA9M7oMRVYO_ml6Gpk6iRL_0HagMytjVEg6Veu7888f4K5IzQJaNQUTFVqE3S17o7Wn8dcCApf8D3CqM78WHag";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PhonebookServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String lastName = request.getParameter("lname");
		if (lastName == null || "".equalsIgnoreCase(lastName))
			lastName = "NOTFOUND";
		URL endpoint = new URL(baseUrl + lastName);
		HttpURLConnection connection = (HttpURLConnection) endpoint.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Authorization", authHeader);
		int responseCode = connection.getResponseCode();
		if (responseCode == HttpURLConnection.HTTP_OK) {
			BufferedReader in = new BufferedReader(new InputStreamReader(
					connection.getInputStream()));
			JsonReader jsonReader = Json.createReader(in);
			JsonObject jsonObject = jsonReader.readObject().getJsonObject("IVTNO_OUTPUT_MSG");
			if (!"".equals(jsonObject.getString("OUT_LAST_NAME")))
				response.getWriter()
						.append("User <abbr title=\"IMSDB SEGNO=")
						.append(jsonObject.getString("OUT_SEGNO"))
						.append(" via Servlet API call\" class=\"initialism\">")
						.append(jsonObject.getString("OUT_LAST_NAME"))
						.append(",").append(jsonObject.getString("OUT_FIRST_NAME")).append("</abbr> Extension num:")
						.append(jsonObject.getString("OUT_EXTENSION"))
						.append(" Postcode: ").append(jsonObject.getString("OUT_ZIP_CODE"));
			else
				response.getWriter()
						.append("User ").append(lastName)
						.append(" not in the phonebook.");
			in.close();
			// String credit = payload.toString();
			// credit = credit.substring(credit.indexOf("Credit") + 8,
			// credit.indexOf("}}"));
			// response.getWriter().append(
			// "Account " + lastName + " has a balance of $" + credit);
		} else {
			response.getWriter()
					.append("User ").append(lastName)
					.append(" not in the phonebook. HTTP_").append(String.valueOf(responseCode));
		}
	}
}
