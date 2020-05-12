#include <stdio.h>
#include <default.c>

void writePnL(string fileName, int minHour)
{
    static var oldPnL = 0;
    static int lastDay = -1;
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

// Example
// function tock() {
// 	if (!is(LOOKBACK)) {
// 		writePnL(LOG_PNL, 15);
// 	}
// }