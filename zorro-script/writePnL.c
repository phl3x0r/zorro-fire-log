/* Small snippet of code to write open trades to csv file

1. Place this file in your Zorro include folder and

2. Place the following in the top of your trade script
#define LOG_PNL "C:\\inetpub\\wwwroot\\logs\\my-pnl.csv"
#include <writePnL.c>


*/
#include <stdio.h>
#include <default.c>

void writePnL(string fileName, int minHour)
{
    static var oldPnL = 0;
    static bool written = true;
    static int lastDay = -1;
	string tradeDirection;
    // only if file does not exist
    vars ft;
    if ((ft = fopen(fileName, "r"))) {
        fclose(ft);
    } else {
        vars fp = fopen(fileName, "w");
        fprintf(fp, "%s", "Date,PnL\n");
        fclose(fp);
    }

	if((ldow() <= 5) and (lhour() >= minHour) and (day() != lastDay)) {
        vars fp = fopen(fileName, "a");
        fprintf(fp, "%04i-%02i-%02i,%.2f\n", 
            year(), 
            month(), 
            day(),
            Equity - oldPnL);
        fclose(fp);
        oldPnL = Equity;
        lastDay = day();
    }
}

function tock() {
	if (!is(LOOKBACK)) {
		writePnL(LOG_PNL, 15);
	}
}