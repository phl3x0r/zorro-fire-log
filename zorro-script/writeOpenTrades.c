/* Small snippet of code to write open trades to csv file

1. Place this file in your Zorro include folder and

2. Place the following in the top of your trade script
#define LOG_OPEN_TRADES "C:\\inetpub\\wwwroot\\logs\\com-no-net_opentrades.csv"
#include <writeOpenTrades.c>

3. Determine when this code is run, in either the tock() internal or run section of your script.

Change Log:
20200504 - Initial script
20200505 - Added EOF flag
20200511 - Fix for Open file, replaced fwrite with fopen and fclose. 

*/
#include <stdio.h>

void writeOpenTrades(string fileName)
{
	string tradeDirection;
	vars fp = fopen(fileName, "w");
	fprintf(fp, "%s", "Name,Type,Asset,ID,Lots,Open,Close,Entry,Exit,Profit,Roll,ExitType");
	fclose(fp);
	for (open_trades)
	{
		// get trade direction, long or short  Name,Type,Asset,ID,Lots,Open,Close,Entry,Exit,Profit,Roll,ExitType
		if (TradeIsLong) {
			tradeDirection = "Long";
		}
		else {
			tradeDirection = "Short";
		}
		fp = fopen(fileName, "a");
		fprintf(fp, "\n%s,%s,%s,%i,%i,%s,%04i-%02i-%02i %02i:%02i,%.5f,%.5f,%.2f,%.2f,Open",
			TradeAlgo,
			tradeDirection,
			TradeAsset,
			TradeID,
			TradeLots,
			strdate("%Y-%m-%d %H:%M", (var)TradeDate),
			year(), month(), day(), hour(), minute(),
			(var)TradePriceOpen,
			price(),
			(var)TradeProfit,
			(var)TradeRoll);
		fclose(fp);
	}
	fp = fopen(fileName, "a");
	fprintf(fp, "%s", "\nEOF");
	fclose(fp);
}

// uncomment this code if you want to write trades at each tock() interval. The tock interval defaults to 60000ms. You can change this with TockTime = xxxxxx; Alternatively you can place this at the end of your run() function and it will run based on BarPeriod of the script. 

function tock() {
	if (!is(LOOKBACK)) {
		string tradeLogFile = LOG_OPEN_TRADES;
		writeOpenTrades(tradeLogFile);
	}
}