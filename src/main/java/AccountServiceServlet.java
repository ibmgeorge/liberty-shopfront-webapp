
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Payload;

/**
 * Servlet implementation class AccountServiceServlet
 */
@WebServlet("/AccountServiceServlet")
public class AccountServiceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String baseUrl = "https://s0w1.duckdns.org:9445/queryacc/account/";
	private String authHeader = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiYXVkIjoiekNFRSIsInN1YiI6InlwZ2VAYXUxLmlibS5jb20iLCJyZWFsbSI6IkFEQ0RQTCIsImlzcyI6ImxpYmVydHkiLCJleHAiOjE2ODE0Nzk0NjksImlhdCI6MTU4MTQ3MjI2OX0.KJlE-wS1N48cWz1F1uDxpSN7uR9fb4uFGxY3o31OxuoQRFjYTXiaadeDzhmBrz0LK30bdi2oGZlfs0DEhFIkC8iwJlKRS4-bMudTLK37E_UW6T6EhjFmO-X8DUNJeiKVEz0rc982QFoGQLCm7T7-YT7HNqId2RFPe1JKWebJfH-zepME-R6CNpsu7f3ZWnJsopCz2ewuOtt72xtozf6ZnAXTUM46bp60vUbh7btha8C9XNHxq2pIKOJ6sJfcWjqjhA9M7oMRVYO_ml6Gpk6iRL_0HagMytjVEg6Veu7888f4K5IzQJaNQUTFVqE3S17o7Wn8dcCApf8D3CqM78WHag";
	private String[] accountList = {"A1234567","A7654321","A9999999","NOTFOUND"};

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AccountServiceServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// Generate ramdon number
		Random rand = new Random();
		int index = Math.abs(rand.nextInt() % 4);
		URL endpoint = new URL(baseUrl + accountList[index]);
		HttpURLConnection connection = (HttpURLConnection) endpoint.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Authorization", authHeader);
		int responseCode = connection.getResponseCode();
		StringBuffer payload = new StringBuffer();
		if (responseCode == HttpURLConnection.HTTP_OK) {
			BufferedReader in = new BufferedReader(new InputStreamReader(
				connection.getInputStream()));
			String inputLine;
			while ((inputLine = in.readLine()) != null) {
				payload.append(inputLine);
			}
			in.close();
		}
		response.getWriter().append("Resp=" + payload.toString() + "[" + responseCode + "]");
	}
}
