#include <stdint.h>

int main(){

}

uint32_t collatz_steps(int n) {
    uint32_t steps = 0;
    while (n != 1) {
        if (n % 2 == 0) {
            n /= 2;
        } else {
            n = 3 * n + 1;
        }
        steps++;
    }
    return steps;
}
